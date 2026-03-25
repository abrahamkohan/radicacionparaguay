import './globals.css'

export const metadata = {
  title: 'Radicación Paraguaya - Ley Nº 6984/22',
  description: 'Somos líderes en la gestión de todo tipo de trámites vinculados con la residencia en Paraguay, con testimonios de miles de personas de todo el mundo.',
  openGraph: {
    title: 'Radicación Paraguaya - Ley Nº 6984/22',
    description: 'Evaluación de radicación con seguridad jurídica.',
    url: 'https://abrahamkohan.com.py',
    siteName: 'Radicación en Paraguay',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_PY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radicación Paraguay',
    description: 'Evaluación migratoria en Paraguay',
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
      <body style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
