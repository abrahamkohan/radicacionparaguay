import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🔍 Iniciando prueba de email...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✓ Configurado' : '✗ NO configurado');
    console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '✓ Configurado' : '✗ NO configurado');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Verificar conexión
    console.log('📧 Verificando conexión a Gmail...');
    await transporter.verify();
    console.log('✅ Conexión verificada');

    // Enviar email de prueba
    console.log('📤 Enviando email de prueba a abrahamkohan.py@gmail.com...');
    const result = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'abrahamkohan.py@gmail.com',
      subject: '🔧 Test RadicacionPY - Vercel + Gmail',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; padding: 20px; background: #e6e8eb;">
          <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #27AE60; margin: 0 0 20px 0;">✅ Test Exitoso</h1>
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
              Si ves este email, la configuración de Gmail en Vercel está <strong>correctamente configurada</strong>.
            </p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #666;">
                <strong>Info del test:</strong><br>
                Hora: ${new Date().toLocaleString('es-PY')}<br>
                Remitente: ${process.env.GMAIL_USER}<br>
                Destinatario: abrahamkohan.py@gmail.com
              </p>
            </div>
            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; border-top: 1px solid #e0e0e0; padding-top: 16px;">
              Este es un email de prueba automático desde RadicacionPY en Vercel.
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: '✅ Email de prueba enviado exitosamente',
      messageId: result.messageId,
      to: 'abrahamkohan.py@gmail.com'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error:', error);
    
    let mensaje = error.message;
    let solucion = '';

    if (error.message.includes('Invalid login')) {
      mensaje = 'Credenciales de Gmail inválidas';
      solucion = 'Verifica que GMAIL_PASSWORD sea una contraseña de aplicación (no la contraseña de Gmail normal)';
    } else if (error.message.includes('connect')) {
      mensaje = 'No se puede conectar a Gmail';
      solucion = 'Verifica la conexión a internet en Vercel';
    } else if (!process.env.GMAIL_USER) {
      mensaje = 'GMAIL_USER no está configurado';
      solucion = 'En Vercel: Settings → Environment Variables → Agrega GMAIL_USER';
    } else if (!process.env.GMAIL_PASSWORD) {
      mensaje = 'GMAIL_PASSWORD no está configurado';
      solucion = 'En Vercel: Settings → Environment Variables → Agrega GMAIL_PASSWORD';
    }

    return NextResponse.json({
      success: false,
      error: mensaje,
      solucion: solucion,
      detalles: error.message
    }, { status: 500 });
  }
}
