import './globals.css'
import type { Metadata } from 'next'
import OfflineWrapper from './components/OfflineWrapper';


const metadata: Metadata = {
  title: 'My Next.js PWA',
  description: 'Progressive Web App with Next.js and TypeScript',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Next TS PWA'
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <meta name="application-name" content="Next.js TypeScript PWA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>{children}
        <OfflineWrapper />
      </body>
    </html>
  )
}