'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Mail, MessageSquare, Linkedin, Twitter, Facebook, Zap } from 'lucide-react'

const SERVICES = [
  {
    name: 'Ask an Engineer',
    sub: 'Energy Advisory Session',
    desc: 'A one-on-one discussion with a VoltSage engineer. We help you understand your energy needs, evaluate potential solutions, and make informed decisions before committing to any system. Starts with a free introductory call.',
  },
  {
    name: 'Independent Design Review',
    sub: 'Verify a quote',
    desc: 'Send us a supplier quote or existing design. We check equipment suitability, sizing accuracy and cost reasonability — with nothing to sell you. Written engineering opinion provided.',
  },
  {
    name: 'Engineering Design Package',
    sub: 'Full design',
    desc: 'Complete engineer-prepared system design: sizing verification, single-line diagram (SLD), bill of quantities (BoQ), simulations and specifications. Available in three tiers from Basic through to Detailed.',
  },
]

const DESIGN_TIERS = [
  { tier: 'Basic Design Package',                  items: 'System sizing · SLD · BOQ' },
  { tier: 'Professional Engineering Design Package', items: 'SLD · layouts · calculations · simulations · BOQ · cable sizing' },
  { tier: 'Detailed Engineering Package',           items: 'Everything above + construction drawings · protection coordination · cable schedules · commissioning docs · procurement support' },
]

/* ── Contact Section ── */
export function ContactSection() {
  const [name,     setName]    = useState('')
  const [contact,  setContact] = useState('')
  const [service,  setService] = useState('Ask an Engineer')
  const [location, setLocation]= useState('')
  const [message,  setMessage] = useState('')
  const [sent,     setSent]    = useState(false)

  const submit = () => {
    if (!name || !contact) { alert('Please add your name and contact details.'); return }
    const body = `Name: ${name}\nContact: ${contact}\nLocation: ${location}\nService: ${service}\n\nMessage:\n${message}`
    const sub  = encodeURIComponent(`VoltSage enquiry — ${service} — ${name}`)
    window.location.href = `mailto:info@voltsage.co.zw?subject=${sub}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="section-eyebrow">Get in touch</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Ready to get<br />
            <span className="brand-text">the right answer?</span>
          </h2>
          <p className="text-slate-400 text-base">
            Run the free sizing tool first — then reach out if you want an engineer
            to review, refine or fully design your system.
          </p>
        </div>

        {/* Service cards — no pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {SERVICES.map((s, i) => (
            <div key={i} className="gradient-border rounded-2xl overflow-hidden card-3d">
              <div className="glass p-6 h-full flex flex-col">
                <div className="text-[10px] font-mono uppercase tracking-widest text-brand-teal mb-1">{s.sub}</div>
                <h3 className="font-disp font-bold text-xl text-white uppercase mb-3">{s.name}</h3>
                <p className="text-slate-400 text-sm flex-1 mb-5">{s.desc}</p>
                <button
                  onClick={() => setService(s.name)}
                  className={`w-full py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all ${
                    service === s.name
                      ? 'text-dark scale-105'
                      : 'text-brand-teal border border-brand-teal/40 hover:bg-brand-teal/10'
                  }`}
                  style={service === s.name
                    ? { background: 'linear-gradient(90deg,#f97316,#eab308)' }
                    : undefined}
                >
                  {service === s.name ? '✓ Selected' : 'Select this service'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Design Package tiers */}
        <div className="glass rounded-2xl p-6 mb-10 border border-white/5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-brand-amber mb-4">
            Engineering Design Package — Service Tiers
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono" style={{ minWidth: 500 }}>
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 pb-3 pr-6 uppercase tracking-wider font-normal">Tier</th>
                  <th className="text-left text-slate-400 pb-3 uppercase tracking-wider font-normal">Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {DESIGN_TIERS.map((t, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-6 text-brand-teal font-medium whitespace-nowrap">{t.tier}</td>
                    <td className="py-3 text-slate-400">{t.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] font-mono text-slate-600 mt-4">
            Contact us to discuss scope and receive a quotation tailored to your project.
          </p>
        </div>

        {/* Form + info */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Form */}
          <div className="glass rounded-2xl p-8">
            <h3 className="font-disp font-bold text-2xl text-white uppercase mb-6">Send an enquiry</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Full name *</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tendai Moyo"
                    className="tool-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Phone or email *</label>
                  <input
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="+263 7… or you@email.com"
                    className="tool-input text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Service needed</label>
                  <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    className="tool-input text-sm"
                  >
                    {SERVICES.map(s => <option key={s.name}>{s.name}</option>)}
                    <option>Other / general enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Location</label>
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Harare"
                    className="tool-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Tell us about your site</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Current power problems, budget range, quote you'd like reviewed…"
                  className="tool-input text-sm resize-none"
                />
              </div>

              <button
                onClick={submit}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(90deg,#f97316,#eab308)' }}
              >
                <Mail size={16} /> Send enquiry
              </button>

              {sent && (
                <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-4 text-sm font-mono text-brand-teal">
                  ✓ Your email client should open with your enquiry ready to send.
                  If not, email us directly at{' '}
                  <a href="mailto:info@voltsage.co.zw" className="underline">info@voltsage.co.zw</a>
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="glass rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-disp font-bold text-2xl text-white uppercase mb-2">Why VoltSage?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Engineer-led. Zero equipment sold.
                Our advice is genuinely independent because we earn nothing from the hardware you buy.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Free tools, always',       desc: 'Residential, agricultural and battery runtime tools — free forever, no sign-up required.' },
                  { label: 'Engineers, not salespeople',desc: 'Every paid service is delivered by a qualified engineer. No sales commissions, no upselling.' },
                  { label: 'Africa-specific data',     desc: 'Location-specific peak sun hours for all 10 Zimbabwe provinces and 30+ African countries.' },
                  { label: 'No conflict of interest',  desc: 'We never profit from equipment you buy. Our only product is engineering clarity.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg,#f97316,#10b981)' }}
                    >
                      <span className="text-dark font-bold text-[9px]">✓</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">{item.label}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">Direct contact</p>
              <div className="space-y-2">
                <a href="mailto:info@voltsage.co.zw"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-teal transition-colors">
                  <Mail size={14} /> info@voltsage.co.zw
                </a>
                <a href="https://wa.me/263"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-green transition-colors">
                  <MessageSquare size={14} /> WhatsApp (Zimbabwe)
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image src="/logo.png" alt="VoltSage" fill className="object-contain" />
              </div>
              <div>
                <div className="font-disp font-bold text-base tracking-widest uppercase">
                  <span className="text-white">VOLT</span>
                  <span className="brand-text-teal">SAGE</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Solutions</div>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Engineering-led energy intelligence for Zimbabwe and the wider African market.
              Free tools. Paid expertise. Zero equipment sold.
            </p>
          </div>

          {/* Free tools */}
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-brand-teal mb-3">Free Tools</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              {[
                ['Residential Sizing Tool', '#sizing'],
                ['Agricultural Sizing Tool', '#agricultural'],
                ['Battery Runtime Calculator', '#battery'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-slate-300 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-brand-orange mb-3">Services</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              {SERVICES.map(s => (
                <li key={s.name}>
                  <a href="#contact" className="hover:text-slate-300 transition-colors">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-brand-green mb-3">Learn</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              {[
                'How we size solar',
                'Why quotes vary',
                'Battery basics',
                'Agricultural loads',
                'Generator vs solar',
              ].map(a => (
                <li key={a}>
                  <a href="#articles" className="hover:text-slate-300 transition-colors">{a}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-slate-600">
            © {new Date().getFullYear()} VoltSage Solutions Ltd ·
            Preliminary sizing tools for planning purposes only — not a substitute for a
            detailed engineering assessment.
          </p>
          <div className="flex gap-4">
            {[
              { icon: <Linkedin size={16} />, href: '#' },
              { icon: <Twitter  size={16} />, href: '#' },
              { icon: <Facebook size={16} />, href: '#' },
            ].map((s, i) => (
              <a key={i} href={s.href}
                className="text-slate-600 hover:text-brand-teal transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
