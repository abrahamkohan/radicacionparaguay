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

    // Construir HTML del email con headers alineados a WhatsApp
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background: #e6e8eb; padding: 16px;">
        
        <!-- Navbar con PARAGUAY MIGRACIONES -->
        <div style="background: white; padding: 20px; border-radius: 12px 12px 0 0; border-bottom: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">
            <span style="color: #0066CC;">PARAGUAY</span> 
            <span style="color: #1a3a52;">MIGRACIONES</span>
          </div>
          <div style="font-size: 11px; color: #999; font-weight: 700; background: rgba(0, 102, 204, 0.1); padding: 6px 12px; border-radius: 12px;">Ley Nº 6984/22</div>
        </div>

        <!-- Card Principal -->
        <div style="background: white; padding: 40px 28px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;">
          
          <h1 style="color: #2c3e50; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px;">Evaluación Completada</h1>
          <p style="color: #999; font-size: 14px; margin: 0 0 32px 0; font-weight: 500;">Tu formulario ha sido recibido correctamente</p>

          <!-- Datos Personales - MISMO EMOJI QUE WHATSAPP -->
          <div style="margin-bottom: 32px;">
            <h2 style="color: #0066CC; font-size: 16px; font-weight: 800; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5; display: flex; align-items: center; gap: 8px;">📋 Datos Personales</h2>
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

          <!-- Clasificación - MISMO EMOJI QUE WHATSAPP -->
          <div style="margin-bottom: 32px;">
            <h2 style="color: #0066CC; font-size: 16px; font-weight: 800; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5; display: flex; align-items: center; gap: 8px;">🏛️ Clasificación de Trámite</h2>
            <div style="background: linear-gradient(135deg, #1a3a52, #2c3e50); color: white; padding: 20px 16px; border-radius: 12px; border-left: 4px solid #27AE60;">
              <p style="margin: 0; font-weight: 800; font-size: 18px; letter-spacing: -0.3px;">${clasificacion}</p>
              ${aranceles ? `<p style="margin: 12px 0 0 0; font-size: 14px; opacity: 0.85; font-weight: 600;">💰 Arancel Estimado: ${aranceles}</p>` : ''}
            </div>
          </div>

          <!-- Documentos - MISMO EMOJI QUE WHATSAPP -->
          <div style="margin-bottom: 32px;">
            <h2 style="color: #0066CC; font-size: 16px; font-weight: 800; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5; display: flex; align-items: center; gap: 8px;">📄 Documentos Adjuntos</h2>
            ${attachments.length > 0 
              ? `<div style="background: linear-gradient(135deg, #E8F5E9, #F1F8E9); border-left: 4px solid #27AE60; padding: 16px; border-radius: 8px;">
                  <p style="margin: 0 0 12px 0; font-weight: 700; color: #2E7D32; font-size: 14px;">✓ Se recibieron ${attachments.length} archivo(s):</p>
                  <ul style="margin: 0; padding-left: 20px; color: #2c3e50; font-size: 13px; line-height: 1.8;">
                    ${attachments.map(att => `<li style="color: #2E7D32; font-weight: 500;">${att.filename}</li>`).join('')}
                  </ul>
                </div>`
              : '<div style="background: #FFF3CD; border-left: 4px solid #ffc107; padding: 16px; border-radius: 8px; color: #856404; font-weight: 600; font-size: 13px;">⚠️ No se adjuntaron documentos</div>'
            }
          </div>

          <!-- Nota importante -->
          <div style="background: linear-gradient(135deg, #E3F2FD, #E1F5FE); border-left: 4px solid #0066CC; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
            <p style="margin: 0; font-size: 12px; color: #1565C0; line-height: 1.6; font-weight: 500;">
              <strong>Próximos pasos:</strong> Pronto te contactaremos por WhatsApp para confirmar los documentos y agendar tu consulta. La emisión del carnet tarda entre 60-90 días hábiles.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; padding: 20px; background: #fafbfc; border-radius: 12px; margin-bottom: 0;">
            <p style="margin: 0; font-size: 13px; color: #666; font-weight: 600;">¿Preguntas? Revisa tu WhatsApp para continuar la conversación</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
          <p style="margin: 0 0 4px 0; font-weight: 700;">© 2026 Abraham Kohan</p>
          <p style="margin: 0; font-size: 11px;">Paraguay Migraciones | Gestor Migratorio Independiente</p>
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
