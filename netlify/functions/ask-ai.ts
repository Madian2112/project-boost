import type { Handler } from "@netlify/functions";
import { HfInference } from "@huggingface/inference";
import { Resend } from "resend";
import knowledgeBase from "../../src/data/knowledgeBase";

const { HF_TOKEN, RESEND_API_KEY, CEO_EMAILS } = process.env;

const systemPrompt = `
  Eres un asistente virtual experto de "Project Boost" llamado "BoostBot". Tu tarea es triple:
  1. Ser un experto en la empresa usando la base de conocimiento.
  2. Ser un conversador general y amigable.
  3. Actuar como un filtro de negocio, identificando consultas importantes.

  Debes devolver SIEMPRE tu respuesta en un formato JSON VÁLIDO con dos campos: "isImportantLead" (un booleano) y "responseForUser" (un string).

  Aquí están las reglas para decidir:

  1. **Si la pregunta del usuario SE PUEDE responder con la base de conocimiento:**
     - "isImportantLead": false
     - "responseForUser": La respuesta directa y profesional basada en el conocimiento.

  2. **Si la pregunta NO SE PUEDE responder con la base de conocimiento, debes decidir si es "importante":**
     - Una pregunta es "IMPORTANTE" si se relaciona con el negocio pero no está en el conocimiento. Ejemplos: preguntas sobre precios, servicios no listados (blockchain, mobile apps), comparaciones con competidores, oportunidades de trabajo, etc.
     - Una pregunta "NO ES IMPORTANTE" si es conocimiento general o trivial. Ejemplos: "¿Quién es el presidente?", "¿Qué hora es?", "hola".

     - **Si la pregunta NO es importante:**
       - "isImportantLead": false
       - "responseForUser": Responde la pregunta usando tu conocimiento general y OBLIGATORIAMENTE añade al final: "\\n\\n¿Quieres saber algo en particular sobre Project Boost?"

     - **Si la pregunta SÍ es importante:**
       - "isImportantLead": true
       - "responseForUser": Responde con sinceridad que no tienes esa información específica, pero que has notificado al equipo. Usa este texto EXACTO: "Esa es una excelente pregunta. No tengo la respuesta en mi base de conocimiento, pero he notificado a los CEOs de Project Boost sobre tu consulta y se pondrán en contacto si es necesario. ¿Hay algo más sobre nuestros servicios actuales en lo que pueda ayudarte?"

  Base de Conocimiento:
  ---
  ${knowledgeBase}
  ---
`;

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
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: question }],
      max_tokens: 500,
    });

    const rawResponse = hfResponse.choices[0].message.content || "{}";
    
    let aiJson: { isImportantLead: boolean; responseForUser: string };
    try {
      aiJson = JSON.parse(rawResponse);
    } catch (e) {
      aiJson = { isImportantLead: false, responseForUser: "Lo siento, tuve un problema para procesar tu solicitud." };
    }

    if (aiJson.isImportantLead === true) {
      await sendNotificationEmail(question, CEO_EMAILS, RESEND_API_KEY);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiJson.responseForUser }),
    };

  } catch (error) {
    console.error("Error en la función serverless:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to get a response from the AI' }) 
    };
  }
};

async function sendNotificationEmail(question: string, ceoEmails: string, resendApiKey: string) {
  const resend = new Resend(resendApiKey);

  const hour = new Date().getHours();
  let greeting = "Buenos días";
  if (hour >= 12 && hour < 19) {
    greeting = "Buenas tardes";
  } else if (hour >= 19 || hour < 5) {
    greeting = "Buenas noches";
  }

  const date = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const emailBody = `
    <p>${greeting} CEO de Project Boost,</p>
    <p>El día <strong>${date}</strong>, un usuario ha realizado una <strong>consulta de negocio importante</strong> para la cual el BoostBot no encontró una respuesta en la base de conocimiento.</p>
    <p>Esta consulta ha sido identificada como una oportunidad potencial o un punto a mejorar en nuestra web.</p>
    <p><strong>Pregunta del usuario:</strong></p>
    <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; margin: 16px 0; color: #555;">
      ${question}
    </blockquote>
    <p>Saludos,<br>Tu Asistente BoostBot</p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: 'BoostBot <bot@projectboost.tech>',
      to: ceoEmails.split(','),
      subject: 'BoostBot: ¡Consulta de Negocio Importante!',
      html: emailBody,
    });
    if (error) {
      console.error("Error devuelto por la API de Resend:", error);
    }
  } catch (emailError) {
    console.error("Error catastrófico al intentar enviar el email:", emailError);
  }
}
