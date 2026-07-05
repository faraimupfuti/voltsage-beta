import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoltSage Solutions — Solar Sizing & Energy Tools',
  description:
    'Free professional solar sizing tools for residential, small commercial and agricultural installations. Size your system correctly before you buy.',
  keywords: 'solar sizing tool, solar calculator, battery runtime, Zimbabwe solar, agricultural solar, solar installation Africa',
  openGraph: {
    title: 'VoltSage Solutions',
    description: 'Free solar sizing tools that work the way engineers do.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-dark text-slate-100 antialiased">{children}</body>
    </html>
  )
}
