import type { Handler } from "@netlify/functions";
import { HfInference } from "@huggingface/inference";
import { Resend } from "resend";
import knowledgeBase from "../../src/data/knowledgeBase";

const { HF_TOKEN, RESEND_API_KEY, CEO_EMAILS } = process.env;

const fallbackMessage = "Actualmente no contamos con esa informacion en nuestra pagina, pero le daremos a conocer tu consulta a los CEO de Project Boost para poderte brindar una respuesta";

const systemPrompt = `
  Eres un asistente virtual experto de la empresa "Project Boost". Tu nombre es "BoostBot".
  Tu única fuente de información es la base de conocimiento que te proporciono. NUNCA debes inventar información.
  Tu tarea es analizar la pregunta del usuario y determinar si se puede responder con la base de conocimiento.
  Debes devolver SIEMPRE tu respuesta en un formato JSON VÁLIDO, con dos campos: "answered" (un booleano) y "response" (un string).

  - Si la pregunta del usuario SE PUEDE responder con la base de conocimiento:
    Establece "answered" en true.
    En el campo "response", escribe la respuesta de forma clara y amable.

  - Si la pregunta del usuario NO SE PUEDE responder con la base de conocimiento:
    Establece "answered" en false.
    En el campo "response", escribe el siguiente texto EXACTAMENTE: "${fallbackMessage}"

  Ejemplo de respuesta si puedes contestar:
  {
    "answered": true,
    "response": "El equipo está formado por Jason Villanueva y Dany Franco, ambos CEO y Desarrolladores Full Stack."
  }

  Ejemplo de respuesta si NO puedes contestar:
  {
    "answered": false,
    "response": "${fallbackMessage}"
  }
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

    const hfResponse = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{ role: "system", content: fullSystemPrompt }, { role: "user", content: question }],
      max_tokens: 500,
    });

    const rawResponse = hfResponse.choices[0].message.content || "{}";
    
    // -- INICIO DE DEBUGGING --
    console.log("Respuesta cruda de la IA:", rawResponse);
    // -- FIN DE DEBUGGING --
    
    let aiJson: { answered: boolean; response: string };
    try {
      aiJson = JSON.parse(rawResponse);
       // -- INICIO DE DEBUGGING --
      console.log("JSON parseado exitosamente:", aiJson);
      // -- FIN DE DEBUGGING --
    } catch (e) {
      // -- INICIO DE DEBUGGING --
      console.error("Error al parsear el JSON de la IA. Asumiendo fallback.", e);
      // -- FIN DE DEBUGGING --
      aiJson = { answered: false, response: fallbackMessage };
    }

    // Lógica de email basada en el booleano
    if (aiJson.answered === false) {
      // -- INICIO DE DEBUGGING --
      console.log("Condición cumplida. Intentando enviar email de notificación...");
      // -- FIN DE DEBUGGING --
      await sendNotificationEmail(question, CEO_EMAILS, RESEND_API_KEY);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiJson.response }),
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
  // -- INICIO DE DEBUGGING AVANZADO --
  console.log("Iniciando sendNotificationEmail...");
  console.log("Emails de CEO:", ceoEmails);
  console.log("Longitud de la Resend API Key:", resendApiKey ? resendApiKey.length : 0);
  // -- FIN DE DEBUGGING AVANZADO --

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
    const { data, error } = await resend.emails.send({
      from: 'BoostBot <onboarding@resend.dev>', // Requerido por Resend en plan gratuito
      to: ceoEmails.split(','),
      subject: 'BoostBot: Consulta de Usuario sin Respuesta',
      html: emailBody,
    });

    if (error) {
      // -- INICIO DE DEBUGGING AVANZADO --
      console.error("Error devuelto por la API de Resend:", error);
      // -- FIN DE DEBUGGING AVANZADO --
      return;
    }

    // -- INICIO DE DEBUGGING AVANZADO --
    console.log("Email enviado exitosamente. ID de Resend:", data?.id);
    // -- FIN DE DEBUGGING AVANZADO --
    
  } catch (emailError) {
    // -- INICIO DE DEBUGGING AVANZADO --
    console.error("Error catastrófico al intentar enviar el email:", emailError);
    // -- FIN DE DEBUGGING AVANZADO --
  }
}
