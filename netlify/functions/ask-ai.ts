import type { Handler } from "@netlify/functions";
import { HfInference } from "@huggingface/inference";
import knowledgeBase from "../../src/data/knowledgeBase";

const { HF_TOKEN } = process.env;

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
  if (!HF_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Hugging Face token not configured' }) };
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
