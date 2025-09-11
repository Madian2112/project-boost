import type { Handler } from "@netlify/functions";
import { HfInference } from "@huggingface/inference";
import { Resend } from "resend";
import knowledgeBase from "../../src/data/knowledgeBase";

const { HF_TOKEN, RESEND_API_KEY, CEO_EMAILS } = process.env;

const fallbackMessage = "Actualmente no contamos con esa informacion en nuestra pagina, pero le daremos a conocer tu consulta a los CEO de Project Boost para poderte brindar una respuesta";

const systemPrompt = `
  Eres un asistente virtual experto de la empresa "Project Boost".
  Tu nombre es "BoostBot".
  Tu única fuente de información es la base de conocimiento que te proporciono a continuación.
  NUNCA debes inventar información que no esté en este texto.
  Tu objetivo es responder a las preguntas del usuario de forma amable y precisa, basándote exclusivamente en la información de la base de conocimiento.
  Si la respuesta a la pregunta del usuario se encuentra en la base de conocimiento, responde de forma clara y concisa.
  Si la respuesta a la pregunta del usuario NO se encuentra en la base de conocimiento, DEBES responder única y exclusivamente con el siguiente mensaje, sin añadir nada más:
  "${fallbackMessage}"
`;

const fullSystemPrompt = `${systemPrompt}\n\nAquí está la base de conocimiento:\n---\n${knowledgeBase}\n---`;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  if (!HF_TOKEN || !RESEND_API_KEY || !CEO_EMAILS) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Environment variables not configured' }) };
  }

  try {
    const { question } = JSON.parse(event.body || "{}");
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No question provided' }) };
    }

    const hf = new HfInference(HF_TOKEN);

    const stream = hf.chatCompletionStream({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "system", content: fullSystemPrompt },
        { role: "user", content: question }
      ],
      max_tokens: 500,
    });

    // Usaremos una variable para reconstruir la respuesta completa mientras la streameamos
    let fullResponse = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.choices && chunk.choices[0].delta.content) {
            const content = chunk.choices[0].delta.content;
            fullResponse += content;
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();

        // Una vez que el stream ha terminado, verificamos la respuesta completa
        if (fullResponse.trim() === fallbackMessage) {
          const resend = new Resend(RESEND_API_KEY);
          try {
            await resend.emails.send({
              from: 'BoostBot <onboarding@resend.dev>', // Requerido por Resend en el plan gratuito
              to: CEO_EMAILS.split(','),
              subject: 'Consulta de Usuario sin Respuesta - Project Boost',
              html: `
                <p>Hola,</p>
                <p>Un usuario en la página web ha realizado una consulta para la cual el BoostBot no encontró una respuesta en la base de conocimiento.</p>
                <p><strong>Pregunta del usuario:</strong></p>
                <blockquote>${question}</blockquote>
                <p>Sería una buena idea revisar esta pregunta para mejorar nuestra base de conocimiento o contactar al cliente si es necesario.</p>
                <p>Saludos,<br>Tu Asistente BoostBot</p>
              `,
            });
          } catch (emailError) {
            console.error("Error enviando el email de notificación:", emailError);
            // No bloqueamos la respuesta al usuario si el email falla
          }
        }
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: readable,
    };
  } catch (error) {
    console.error("Error en la función serverless:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to get a response from the AI' }) 
    };
  }
};
