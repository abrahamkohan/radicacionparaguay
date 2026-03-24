import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extraer datos del formulario
    const nombre = formData.get('nombre');
    const nacionalidad = formData.get('nacionalidad');
    const paisResidencia = formData.get('paisResidencia');
    const edad = formData.get('edad');
    const estadoCivil = formData.get('estadoCivil');
    const carnetTemporal = formData.get('carnetTemporal') === 'true';
    const clasificacion = formData.get('clasificacion');
    const aranceles = formData.get('aranceles');

    // Preparar archivos como attachments
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

    // Construir HTML del email
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #2c3e50;">
        
        <div style="background: linear-gradient(135deg, #0066CC, #1a3a52); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800;">Nueva Evaluación de Radicación</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Formulario completado</p>
        </div>

        <div style="background: white; padding: 40px 20px; border: 1px solid #e0e0e0; border-top: none;">
          
          <h2 style="color: #0066CC; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #f5f5f5;">📋 Datos Personales</h2>
          <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666; width: 30%;">Nombre:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Nacionalidad:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${nacionalidad}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">País de Residencia:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${paisResidencia}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Edad:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${edad} años</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Estado Civil:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${estadoCivil}</td>
            </tr>
          </table>

          <h2 style="color: #0066CC; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #f5f5f5;">🏛️ Clasificación</h2>
          <div style="background: linear-gradient(135deg, #E8F0FF, #F1F8E9); padding: 16px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #0066CC;">
            <p style="margin: 0; font-weight: 700; color: #0066CC; font-size: 16px;">${clasificacion}</p>
            ${aranceles ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Arancel: ${aranceles}</p>` : ''}
          </div>

          <h2 style="color: #0066CC; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #f5f5f5;">📄 Documentos Adjuntos</h2>
          ${attachments.length > 0 
            ? `<ul style="margin: 0 0 30px 0; padding-left: 20px; color: #2c3e50;">
                ${attachments.map(att => `<li style="margin-bottom: 6px;">${att.filename}</li>`).join('')}
              </ul>`
            : '<p style="color: #999; margin-bottom: 30px;">No se adjuntaron documentos</p>'
          }

          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #27AE60;">
            <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.6;">
              <strong>Nota:</strong> Este correo contiene toda la información del formulario completado. Los documentos están adjuntos para su revisión.
            </p>
          </div>

        </div>

        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px; color: #999;">
          <p style="margin: 0;">© 2026 Abraham Kohan - Gestor Migratorio</p>
          <p style="margin: 4px 0 0 0;">Paraguay Migraciones</p>
        </div>

      </div>
    `;

    // Enviar email con Resend
    const response = await resend.emails.send({
      from: 'RadicacionPY <onboarding@resend.dev>', // Cambia por tu dominio verificado
      to: 'info@abrahamkohan.com.py', // Tu email de recepción
      subject: `Nueva Evaluación: ${nombre} - ${nacionalidad}`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email enviado correctamente',
        id: response.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al enviar el email',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
