'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

const NAV = [
  { label: 'Why VoltSage', href: '#why' },
  { label: 'Problems We Solve', href: '#problems' },
  { label: 'Sizing Tool', href: '#sizing' },
  { label: 'Agricultural', href: '#agricultural' },
  { label: 'Battery Runtime', href: '#battery' },
  { label: 'Articles', href: '#articles' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-xl shadow-black/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src="/logo.png" alt="VoltSage Solutions" fill className="object-contain" />
          </div>
          <div className="leading-none">
            <span className="font-disp font-bold text-lg tracking-widest uppercase">
              <span className="text-white">VOLT</span>
              <span className="brand-text-teal">SAGE</span>
            </span>
            <p className="text-[9px] font-mono tracking-[0.18em] text-slate-400 uppercase">Solutions</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map(n => (
            <a
              key={n.href}
              href={n.href}
              className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-brand-teal transition-colors duration-200"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#sizing"
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest font-semibold text-dark transition-all duration-200 hover:scale-105 active:scale-100"
          style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}
        >
          <Zap size={14} />
          Size My Load
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden glass border-t border-white/5 overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {NAV.map(n => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="py-3 px-3 text-sm font-mono uppercase tracking-wider text-slate-300 hover:text-brand-teal hover:bg-white/5 rounded-lg transition-all"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#sizing"
            onClick={() => setOpen(false)}
            className="mt-2 py-3 px-4 rounded-lg text-sm font-mono uppercase tracking-wider font-bold text-dark text-center"
            style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}
          >
            Size My Load Free →
          </a>
        </div>
      </div>
    </header>
  )
}
