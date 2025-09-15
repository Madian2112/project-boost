import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

const { RESEND_API_KEY, CEO_EMAILS } = process.env;

interface RequestBody {
  question: string;
  userEmail?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  if (!RESEND_API_KEY || !CEO_EMAILS) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Environment variables not configured correctly' }) };
  }

  try {
    const { question, userEmail } = JSON.parse(event.body || "{}") as RequestBody;
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No question provided' }) };
    }

    const resend = new Resend(RESEND_API_KEY);
    const date = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // 1. Enviar notificación a los CEOs
    const ceoEmailBody = `
      <p>Hola CEOs de Project Boost,</p>
      <p>El día <strong>${date}</strong>, un usuario realizó una consulta importante para la cual el bot no tenía respuesta.</p>
      ${userEmail ? `<p>El usuario ha dejado su email para seguimiento: <strong>${userEmail}</strong></p>` : '<p>El usuario ha decidido no dejar su email de contacto.</p>'}
      <p><strong>Pregunta original del usuario:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; margin: 16px 0;">${question}</blockquote>
    `;
    await resend.emails.send({
      from: 'BoostBot Lead <bot@projectboost.tech>',
      to: CEO_EMAILS.split(','),
      subject: 'BoostBot: ¡Nuevo Lead de Negocio Capturado!',
      html: ceoEmailBody,
    });

    // 2. Si el usuario dejó su email, enviarle la confirmación
    if (userEmail) {
        const userEmailBody = `
        <p>👋 ¡Hola!</p>
        <p>Soy <strong>BoostBot</strong> y es un gusto saludarte.</p>
        <p>Hemos recibido tu consulta: "<em>${question}</em>" 📝</p>
        <p>En breve, el equipo de <strong>Project Boost</strong> se pondrá en contacto contigo para darle seguimiento.</p>
        <p>✨ ¡Gracias por confiar en nosotros!</p>
        <hr>
        <p>📩 Si tienes otra duda, puedes escribirnos directamente a <a href="mailto:projectboosthn@gmail.com">projectboosthn@gmail.com</a>.</p>
        <p>Saludos cordiales, <br> El equipo de Project Boost</p>
      `;
      await resend.emails.send({
        from: 'Project Boost <bot@projectboost.tech>',
        to: [userEmail],
        subject: 'Gracias por tu consulta a Project Boost',
        html: userEmailBody,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notifications sent successfully" }),
    };

  } catch (error) {
    console.error("Error en notify-ceos:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send notifications' }) };
  }
};
