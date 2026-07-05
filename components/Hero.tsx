'use client'
import { useEffect, useRef } from 'react'
import { Zap, ChevronDown } from 'lucide-react'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    interface Particle {
      x: number; y: number; vx: number; vy: number
      r: number; life: number; maxLife: number
      hue: number
    }
    const particles: Particle[] = []
    let t = 0

    function resize() {
      W = canvas!.width  = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function spawn() {
      const cx = W * 0.62, cy = H * 0.5
      const angle = Math.random() * Math.PI * 2
      const speed = 0.4 + Math.random() * 1.2
      const r     = 60 + Math.random() * 120
      particles.push({
        x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.5 - Math.random() * 1.2,
        r:  1 + Math.random() * 2.5,
        life: 0, maxLife: 80 + Math.random() * 120,
        hue: Math.random() > 0.5 ? 30 : 185, // orange or teal
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      t++

      // Spawn particles
      if (t % 3 === 0) spawn()
      if (particles.length > 200) particles.splice(0, 10)

      // Solar ring (center-right)
      const cx = W * 0.62, cy = H * 0.5
      const outerR = Math.min(W, H) * 0.28

      // Outer ring glow
      for (let ring = 3; ring >= 1; ring--) {
        ctx!.beginPath()
        ctx!.arc(cx, cy, outerR + ring * 12, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(6,182,212,${0.04 / ring})`
        ctx!.lineWidth = ring * 8
        ctx!.stroke()
      }

      // Rotating dashed ring
      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.rotate(t * 0.004)
      ctx!.setLineDash([20, 10])
      ctx!.beginPath()
      ctx!.arc(0, 0, outerR, 0, Math.PI * 2)
      ctx!.strokeStyle = 'rgba(6,182,212,0.25)'
      ctx!.lineWidth = 1.5
      ctx!.stroke()
      ctx!.restore()

      // Inner ring (slower, opposite)
      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.rotate(-t * 0.002)
      ctx!.setLineDash([6, 16])
      ctx!.beginPath()
      ctx!.arc(0, 0, outerR * 0.72, 0, Math.PI * 2)
      ctx!.strokeStyle = 'rgba(249,115,22,0.20)'
      ctx!.lineWidth = 1.5
      ctx!.stroke()
      ctx!.restore()
      ctx!.setLineDash([])

      // Orbiting dots
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.006
        const ox = cx + Math.cos(a) * outerR
        const oy = cy + Math.sin(a) * outerR
        const grd = ctx!.createRadialGradient(ox, oy, 0, ox, oy, 5)
        grd.addColorStop(0, 'rgba(6,182,212,0.9)')
        grd.addColorStop(1, 'rgba(6,182,212,0)')
        ctx!.beginPath(); ctx!.arc(ox, oy, 4, 0, Math.PI * 2)
        ctx!.fillStyle = grd; ctx!.fill()
      }
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 - t * 0.008
        const ox = cx + Math.cos(a) * outerR * 0.72
        const oy = cy + Math.sin(a) * outerR * 0.72
        ctx!.beginPath(); ctx!.arc(ox, oy, 3, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(249,115,22,0.85)'; ctx!.fill()
      }

      // Solar icon core
      const pulse = 1 + Math.sin(t * 0.04) * 0.06
      const coreR = outerR * 0.35 * pulse
      const coreGrd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      coreGrd.addColorStop(0,   'rgba(234,179,8,0.95)')
      coreGrd.addColorStop(0.5, 'rgba(249,115,22,0.7)')
      coreGrd.addColorStop(1,   'rgba(249,115,22,0)')
      ctx!.beginPath(); ctx!.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx!.fillStyle = coreGrd; ctx!.fill()

      // Sunrays
      ctx!.save(); ctx!.translate(cx, cy); ctx!.rotate(t * 0.012)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        const len = outerR * 0.15 * (1 + Math.sin(t * 0.05 + i) * 0.2)
        ctx!.beginPath()
        ctx!.moveTo(Math.cos(a) * coreR * 0.8, Math.sin(a) * coreR * 0.8)
        ctx!.lineTo(Math.cos(a) * (coreR + len), Math.sin(a) * (coreR + len))
        ctx!.strokeStyle = 'rgba(234,179,8,0.6)'
        ctx!.lineWidth = 2; ctx!.stroke()
      }
      ctx!.restore()

      // Histogram bars (left cluster) — represents a 24h load profile
      if (W > 600) {
        const barData = [0.2,0.1,0.1,0.15,0.3,0.5,0.7,0.8,0.65,0.55,0.6,0.55,0.5,0.45,0.5,0.55,0.7,0.85,0.9,0.75,0.6,0.45,0.3,0.2]
        const bx = W * 0.06, by = H * 0.72
        const bw = Math.min(W * 0.30, 280), bh = H * 0.22
        const barW = bw / 24 - 2
        barData.forEach((v, i) => {
          const x = bx + i * (bw / 24), h = v * bh
          const grad = ctx!.createLinearGradient(0, by - h, 0, by)
          grad.addColorStop(0, i < 6 || i > 20 ? 'rgba(249,115,22,0.7)' : 'rgba(6,182,212,0.7)')
          grad.addColorStop(1, 'rgba(0,0,0,0)')
          ctx!.fillStyle = grad
          ctx!.fillRect(x, by - h, barW, h)
        })
        ctx!.fillStyle = 'rgba(248,250,252,0.25)'
        ctx!.font = `${Math.min(10,W*0.013)}px JetBrains Mono, monospace`
        ctx!.fillText('24-hour Load Profile', bx, by + 16)
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.life++
        if (p.life > p.maxLife) { particles.splice(i, 1); continue }
        const progress = p.life / p.maxLife
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8
        const color = p.hue === 30 ? `rgba(249,115,22,${alpha * 0.8})` : `rgba(6,182,212,${alpha * 0.8})`
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = color; ctx!.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-grid">
      {/* Radial glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
      </div>

      {/* Three.js-like canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.85 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="max-w-2xl">
          <div className="section-eyebrow mb-4">Engineering-led energy intelligence</div>

          <h1 className="font-disp font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            <span className="text-white">Know your</span><br />
            <span className="brand-text">solar needs</span><br />
            <span className="text-white">before you spend</span><br />
            <span className="text-slate-300 text-4xl sm:text-5xl lg:text-6xl">a single dollar.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-4 max-w-xl">
            Free professional solar sizing tools — built the way engineers design systems,
            made simple enough for anyone to use. No sign-up. No cost. No guesswork.
          </p>
          <p className="text-base text-slate-400 mb-8 max-w-lg">
            Whether you're a homeowner, farmer, or solar installer — size your inverter,
            battery and PV array in minutes, not days.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#sizing"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-dark text-sm font-mono uppercase tracking-wider hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}
            >
              <Zap size={16} />
              Size Your Load — Free
            </a>
            <a
              href="#problems"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-mono uppercase tracking-wider text-slate-300 border border-white/10 hover:border-brand-teal hover:text-brand-teal transition-all"
            >
              Why this matters →
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { val: '100%', label: 'Free to use' },
              { val: '24h',  label: 'Load profile engine' },
              { val: '3',    label: 'Sizing tools' },
              { val: 'Rev.1',label: 'Engineering methodology' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-mono font-bold text-xl brand-text-amber">{s.val}</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={22} className="text-slate-500" />
      </div>
    </section>
  )
}
