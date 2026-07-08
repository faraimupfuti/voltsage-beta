import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoltSage Solutions — Solar Sizing & Energy Tools',
  description:
    'Free professional solar sizing tools for residential, small commercial and agricultural installations across Zimbabwe and Africa. Size your solar system correctly before you spend a dollar.',
  keywords: [
    'solar sizing tool',
    'solar calculator Zimbabwe',
    'battery runtime calculator',
    'agricultural solar sizing',
    'borehole pump solar',
    'solar installation Africa',
    'inverter sizing tool',
    'PV array calculator',
    'energy intelligence platform',
    'VoltSage Solutions',
  ].join(', '),
  authors: [{ name: 'VoltSage Solutions Ltd' }],
  openGraph: {
    title: 'VoltSage Solutions — Free Solar Sizing Tools',
    description:
      'Free engineering-grade solar sizing tools — residential, agricultural, and battery runtime. Built the way engineers design systems, simple enough for anyone.',
    type: 'website',
    locale: 'en_ZW',
    siteName: 'VoltSage Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoltSage Solutions — Free Solar Sizing Tools',
    description: 'Size your solar system correctly before you buy. Free tools. No sign-up.',
  },
  robots: { index: true, follow: true },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Cloudflare Web Analytics */}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fd494aad6ebb456eb67e072c220d16e4"}'
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-dark text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
