import './globals.css'

export const metadata = {
  title: 'Radicación en Paraguay - Ley Nº 6984/22',
  description: 'Asesoramiento profesional para tu residencia en Paraguay.',

  openGraph: {
    title: 'Radicación en Paraguay - Ley Nº 6984/22',
    description: 'Asesoramiento profesional para tu residencia en Paraguay.',
    url: 'https://abrahamkohan.com.py',   
    siteName: 'Radicación Paraguay',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Radicación en Paraguay - Evaluación migratoria',
      },
    ],
    locale: 'es_PY',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Radicación en Paraguay',
    description: 'Evaluación migratoria y documentación requerida en Paraguay',
    images: ['/og-image.jpg'],
  },
}

export const viewport = 'width=device-width, initial-scale=1'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  )
}
