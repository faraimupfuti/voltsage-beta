'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Mail, MessageSquare, Linkedin, Twitter, Facebook } from 'lucide-react'

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

        <div className="max-w-2xl mb-12">
          <div className="section-eyebrow">Talk to us — after you've used the tools</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Come to us first.<br />
            <span className="brand-text">Buy with confidence.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Use the free sizing tools above to get your numbers. Then reach out if you want
            an engineer to review a quote you've received, refine your sizing, or design
            your system from scratch. We help you before the money leaves your pocket.
          </p>
        </div>

        {/* Simple service cards — no tiers, no pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            {
              sub: 'Sizing tool advisory',
              name: 'Learn how to use a sizing tool',
              desc: 'A one-on-one conversation with a VoltSage representative. We help you understand your energy needs and what size system you actually require — before you commit to buying anything.',
              value: 'Learn how to use a sizing tool',
            },
            {
              sub: 'Check a quote you already have',
              name: 'Solar Quote Review',
              desc: 'Already received a quote from an installer? Send it to us. We check whether the equipment is the right size for your needs and whether the specification makes engineering sense — with nothing to sell you.',
              value: 'Solar Quote Review',
            },
            {
              sub: 'General questions',
              name: 'General solar questions',
              desc: 'Contact us to discuss your solar questions.',
              value: 'General solar questions',
            },
          ].map((s, i) => (
            <div key={i} className="gradient-border rounded-2xl overflow-hidden card-3d">
              <div className="glass p-6 h-full flex flex-col">
                <div className="text-[10px] font-mono uppercase tracking-widest text-brand-teal mb-1">{s.sub}</div>
                <h3 className="font-disp font-bold text-xl text-white uppercase mb-3">{s.name}</h3>
                <p className="text-slate-400 text-sm flex-1 mb-5">{s.desc}</p>
                <button
                  onClick={() => setService(s.value)}
                  className={`w-full py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all ${
                    service === s.value
                      ? 'text-dark scale-105'
                      : 'text-brand-teal border border-brand-teal/40 hover:bg-brand-teal/10'
                  }`}
                  style={service === s.value ? { background: 'linear-gradient(90deg,#f97316,#eab308)' } : undefined}
                >
                  {service === s.value ? '✓ Selected' : 'Select this service'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form + info */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8">
            <h3 className="font-disp font-bold text-2xl text-white uppercase mb-6">Send an enquiry</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Full name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tendai Moyo" className="tool-input text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Phone or email *</label>
                  <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+263 7… or you@email.com" className="tool-input text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Service needed</label>
                  <select value={service} onChange={e => setService(e.target.value)} className="tool-input text-sm">
                    <option>Learn how to use a sizing tool</option>
                    <option>Qoute Review</option>
                    <option>General enquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Harare" className="tool-input text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Tell us about your site</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                  placeholder="What do you need to power? Do you have a quote already? What's your budget range?"
                  className="tool-input text-sm resize-none" />
              </div>
              <button onClick={submit}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(90deg,#f97316,#eab308)' }}>
                <Mail size={16} /> Send enquiry
              </button>
              {sent && (
                <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-4 text-sm font-mono text-brand-teal">
                  ✓ Your email client should open. If not, email us at{' '}
                  <a href="mailto:info@voltsage.co.zw" className="underline">info@voltsage.co.zw</a>
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-disp font-bold text-2xl text-white uppercase mb-2">
                What VoltSage does
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                We help individuals and businesses understand exactly what solar system they need
                — before they spend any money. Our tools are free. Our advice is independent.
                We earn nothing from equipment sales.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Use our tools first',        desc: 'Free residential, agricultural and battery runtime tools — no sign-up, no cost, available right now.' },
                  { label: 'Get informed, not sold to',  desc: 'We explain your numbers in plain language so you understand what you\'re buying before you buy it.' },
                  { label: 'Compare quotes confidently', desc: 'Walk into any installer conversation knowing your required inverter size, battery and PV array.' },
                  { label: 'No conflict of interest',    desc: 'We never profit from equipment. Our only product is helping you make the right decision.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg,#f97316,#10b981)' }}>
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
                <a href="mailto:info@voltsage.co.zw" className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-teal transition-colors">
                  <Mail size={14} /> info@voltsage.co.zw
                </a>
                <a href="https://wa.me/263" className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-green transition-colors">
                  <MessageSquare size={14} /> WhatsApp
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
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image src="/logo.png" alt="VoltSage" fill className="object-contain" />
              </div>
              <div>
                <div className="font-disp font-bold text-base tracking-widest uppercase">
                  <span className="text-white">VOLT</span><span className="brand-text-teal">SAGE</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Solutions</div>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Use our free tools before you buy a solar system. Know your numbers.
              Make a confident decision. We sell no equipment — ever.
            </p>
          </div>
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-brand-teal mb-3">Free Tools</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              {[['Residential Sizing Tool','#sizing'],['Agricultural Sizing Tool','#agricultural'],['Battery Runtime Calculator','#battery']].map(([l,h]) => (
                <li key={l}><a href={h} className="hover:text-slate-300 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-brand-orange mb-3">Services</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              {['Ask an Engineer','Independent Design Review','Engineering Design Package'].map(s => (
                <li key={s}><a href="#contact" className="hover:text-slate-300 transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-brand-green mb-3">Learn</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              {['Why quotes vary','Surge demand explained','kW vs kVA','Battery technologies','Battery capacity','Solar vs generator'].map(a => (
                <li key={a}><a href="#articles" className="hover:text-slate-300 transition-colors">{a}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-slate-600">
            © {new Date().getFullYear()} VoltSage Solutions Ltd ·
            Preliminary sizing tools for planning purposes only — not a substitute for a detailed engineering assessment.
          </p>
          <div className="flex gap-4">
            {[<Linkedin size={16} key="li"/>,<Twitter size={16} key="tw"/>,<Facebook size={16} key="fb"/>].map((icon, i) => (
              <a key={i} href="#" className="text-slate-600 hover:text-brand-teal transition-colors">{icon}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
