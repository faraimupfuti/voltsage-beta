'use client'
import { CheckCircle, Clock, BookOpen, Cpu, Globe, Lock } from 'lucide-react'

const BENEFITS = [
  { icon: CheckCircle, title: 'Correct system size, guaranteed', body: 'Our tools build a real 24-hour load profile from your appliances and schedules — the same way a qualified engineer designs a first-pass system. Not a rough estimate.' },
  { icon: Clock, title: 'Results in under 5 minutes', body: 'Add your appliances, set their operating times, pick your province. The inverter size, battery capacity and PV array recommendation update live — no waiting, no email sign-up.' },
  { icon: BookOpen, title: 'Plain language throughout', body: 'We explain every term as you go. Peak sun hours, depth of discharge, surge demand — you will understand exactly what each number means before you speak to any installer.' },
  { icon: Cpu, title: 'Engineering methodology, not marketing', body: 'Built on VoltSage\'s Solar Design Calculation Methodology (Revision 1). Battery is sized from night energy, not total daily load. PV is sized to cover daytime use and recharge the battery — the way it should be.' },
  { icon: Globe, title: 'Covers Zimbabwe and 30+ African countries', body: 'Pick your exact province or country. Peak sun hours are set automatically from our engineering database — so your system is sized for your actual location, not a generic average.' },
  { icon: Lock, title: 'Always free. No strings attached.', body: 'Residential sizing, agricultural sizing, and battery runtime — all free, forever. We make money from paid engineering services, not from locking basic tools behind paywalls.' },
]

export default function WhyTools() {
  return (
    <section id="why" className="py-24" style={{ background: 'linear-gradient(180deg, #050709 0%, #0d1117 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-eyebrow justify-center">Why use our tools?</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-5">
            Built for people who want<br />
            <span className="brand-text">the right answer, not a sale</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Every tool on this site is free and independent. We don't sell panels, inverters or batteries.
            We sell engineering clarity — and the tools are our proof of that.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => (
            <div key={i} className="group relative glass rounded-2xl p-6 card-3d overflow-hidden">
              {/* gradient accent top */}
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: i % 2 === 0 ? 'linear-gradient(90deg, #f97316, #eab308)' : 'linear-gradient(90deg, #06b6d4, #10b981)' }} />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: i % 2 === 0 ? 'rgba(249,115,22,0.12)' : 'rgba(6,182,212,0.12)' }}>
                  <b.icon size={20} className={i % 2 === 0 ? 'text-brand-orange' : 'text-brand-teal'} />
                </div>
                <h3 className="font-disp font-bold text-lg text-white uppercase leading-tight">{b.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
