// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans, Open_Sans } from 'next/font/google'
import { AuthProvider } from './components/AuthProvider'
import ClientLayoutWrapper from './ClientLayoutWrapper'
import FirstVisitHandler from './components/FirstVisitHandler'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
  weight: ['400', '600', '700', '800']
});
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: 'MediMerge - Layanan Darurat Medis',
  description: 'Platform kesehatan terintegrasi dengan sistem darurat medis berbasis teknologi',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MediMerge'
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
        <meta name="application-name" content="MediMerge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4B56D2" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/LOGO.svg" />
        <script src="/sw-register.js" defer></script>
      </head>
      <body className={nunitoSans.className}>
        <AuthProvider>
          <ClientLayoutWrapper fonts={`${nunitoSans.variable} ${openSans.variable}`}>
            <FirstVisitHandler>
              {children}
            </FirstVisitHandler>
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}