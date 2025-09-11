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
    return { statusCode: 500, body: JSON.stringify({ error: 'Environment variables not configured correctly' }) };
  }

  try {
    const { question } = JSON.parse(event.body || "{}");
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No question provided' }) };
    }

    const hf = new HfInference(HF_TOKEN);

    const response = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{ role: "system", content: fullSystemPrompt }, { role: "user", content: question }],
      max_tokens: 500,
    });

    const answer = response.choices[0].message.content || "Lo siento, no pude generar una respuesta.";

    // Lógica para enviar el email si la respuesta es el fallback
    if (answer.trim() === fallbackMessage) {
      // Usamos 'await' pero no bloqueamos la respuesta al usuario. 
      // Netlify Functions permite que esto se complete en segundo plano.
      sendNotificationEmail(question, CEO_EMAILS, RESEND_API_KEY);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };

  } catch (error) {
    console.error("Error en la función serverless:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to get a response from the AI' }) 
    };
  }
};

// Función auxiliar para enviar el email
async function sendNotificationEmail(question: string, ceoEmails: string, resendApiKey: string) {
  const resend = new Resend(resendApiKey);

  // Generar saludo dinámico
  const hour = new Date().getHours();
  let greeting = "Buenos días";
  if (hour >= 12 && hour < 19) {
    greeting = "Buenas tardes";
  } else if (hour >= 19 || hour < 5) {
    greeting = "Buenas noches";
  }

  // Formatear la fecha
  const date = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const emailBody = `
    <p>${greeting} CEO de Project Boost,</p>
    <p>El día <strong>${date}</strong>, un usuario le hizo una consulta a nuestro bot BoostBot de la cual no se tiene la información suficiente en el sitio web para brindarle una respuesta.</p>
    <p>Te dejo la consulta del usuario por aquí:</p>
    <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; margin: 16px 0; color: #555;">
      ${question}
    </blockquote>
    <p>Espero pronto podás agregar información referente a esa consulta, ¡ten un excelente día!</p>
  `;

  try {
    await resend.emails.send({
      from: 'BoostBot <onboarding@resend.dev>', // Requerido por Resend en plan gratuito
      to: ceoEmails.split(','),
      subject: 'BoostBot: Consulta de Usuario sin Respuesta',
      html: emailBody,
    });
    console.log("Email de notificación enviado exitosamente.");
  } catch (emailError) {
    console.error("Error enviando el email de notificación:", emailError);
  }
}
