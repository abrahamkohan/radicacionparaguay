import './globals.css'

export const metadata = {
  title: 'Radicación Paraguay - Ley N° 6984/22',
  description: 'Evaluación de radicación con seguridad jurídica',
}

export const viewport = 'width=device-width, initial-scale=1'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
