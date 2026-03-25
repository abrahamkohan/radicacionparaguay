import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const nombre = formData.get('nombre');
    const nacionalidad = formData.get('nacionalidad');
    const paisResidencia = formData.get('paisResidencia');
    const edad = formData.get('edad');
    const estadoCivil = formData.get('estadoCivil');
    const clasificacion = formData.get('clasificacion');

    // Preparar adjuntos
    const attachments = [];
    const entries = Array.from(formData.entries());
    
    for (const [key, value] of entries) {
      if (key.startsWith('archivo_') && value instanceof File) {
        const bytes = await value.arrayBuffer();
        attachments.push({
          filename: value.name,
          content: Buffer.from(bytes)
        });
      }
    }

    // HTML del email
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background: #e6e8eb; padding: 16px;">
        
        <div style="background: white; padding: 20px; border-radius: 12px 12px 0 0; border-bottom: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">
            <span style="color: #0066CC;">PARAGUAY</span> 
            <span style="color: #1a3a52;">MIGRACIONES</span>
          </div>
          <div style="font-size: 11px; color: #999; font-weight: 700; background: rgba(0, 102, 204, 0.1); padding: 6px 12px; border-radius: 12px;">Ley Nº 6984/22</div>
        </div>

        <div style="background: white; padding: 40px 28px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;">
          
          <h1 style="color: #2c3e50; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">Evaluación Completada</h1>
          <p style="color: #999; font-size: 14px; margin: 0 0 32px 0;">Tu formulario ha sido recibido</p>

          <div style="margin-bottom: 32px;">
            <h2 style="color: #0066CC; font-size: 16px; font-weight: 800; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5;">📋 Datos Personales</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #1a3a52; width: 35%;">Nombre</td>
                <td style="padding: 10px 0; color: #2c3e50;">${nombre}</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a3a52;">Nacionalidad</td>
                <td style="padding: 10px 0; color: #2c3e50;">${nacionalidad}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #1a3a52;">País de Residencia</td>
                <td style="padding: 10px 0; color: #2c3e50;">${paisResidencia}</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a3a52;">Edad</td>
                <td style="padding: 10px 0; color: #2c3e50;">${edad} años</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #1a3a52;">Estado Civil</td>
                <td style="padding: 10px 0; color: #2c3e50;">${estadoCivil}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 32px;">
            <h2 style="color: #0066CC; font-size: 16px; font-weight: 800; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5;">🏛️ Clasificación de Trámite</h2>
            <div style="background: linear-gradient(135deg, #1a3a52, #2c3e50); color: white; padding: 20px 16px; border-radius: 12px;">
              <p style="margin: 0; font-weight: 800; font-size: 18px;">${clasificacion}</p>
            </div>
          </div>

          <div style="margin-bottom: 32px;">
            <h2 style="color: #0066CC; font-size: 16px; font-weight: 800; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5;">📄 Documentos Adjuntos</h2>
            ${attachments.length > 0 
              ? `<div style="background: linear-gradient(135deg, #E8F5E9, #F1F8E9); border-left: 4px solid #27AE60; padding: 16px; border-radius: 8px;">
                  <p style="margin: 0 0 12px 0; font-weight: 700; color: #2E7D32;">✓ ${attachments.length} archivo(s) adjunto(s)</p>
                </div>`
              : '<div style="background: #FFF3CD; border-left: 4px solid #ffc107; padding: 16px; border-radius: 8px; color: #856404;">⚠️ Sin documentos adjuntos</div>'
            }
          </div>

          <div style="background: linear-gradient(135deg, #E3F2FD, #E1F5FE); border-left: 4px solid #0066CC; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #1565C0; font-weight: 500;">
              <strong>Próximos pasos:</strong> Pronto te contactaremos por WhatsApp para confirmar los documentos.
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
          <p style="margin: 0 0 4px 0; font-weight: 700;">© 2026 Abraham Kohan</p>
          <p style="margin: 0; font-size: 11px;">Paraguay Migraciones</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'abrahamkohan.py@gmail.com',
      subject: `Nueva Evaluación: ${nombre} - ${nacionalidad}`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    return NextResponse.json(
      { success: true, message: 'Email enviado correctamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { success: false, message: 'Error al enviar el email', error: error.message },
      { status: 500 }
    );
  }
}
