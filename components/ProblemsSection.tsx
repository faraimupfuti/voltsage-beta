'use client'
import { AlertTriangle, BadgeDollarSign, HelpCircle, FileWarning, Gauge, ShieldOff } from 'lucide-react'

const PROBLEMS = [
  {
    icon: <Gauge size={26} />,
    title: 'Installers size systems by guessing',
    body: 'Most solar installers don\'t do a proper load analysis before recommending a system size. They estimate based on your electricity bill or the number of bedrooms — not on what appliances you actually run and when. The result is a system that\'s either too big (you overpay) or too small (it trips and underperforms).',
    stat: 'A 10-minute load analysis prevents years of regret.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    title: 'Three quotes, three different systems — which is right?',
    body: 'One installer says 5 kW, another says 8 kW, a third says 10 kW — all for the same house. Without knowing your own numbers, you can\'t judge which is correct. You end up choosing on price, not on accuracy.',
    stat: 'Know your numbers first. Then compare quotes on equal terms.',
  },
  {
    icon: <HelpCircle size={26} />,
    title: 'Solar jargon keeps buyers in the dark',
    body: 'kWp, DoD, PSH, SLD, BoQ — the industry is full of technical terms that most buyers don\'t understand. This information gap benefits sellers, not buyers. You should understand what you\'re buying before you sign anything.',
    stat: 'Our tools and articles explain everything in plain English.',
  },
  {
    icon: <FileWarning size={26} />,
    title: 'Nobody tells you how long your battery will actually last',
    body: 'A "10 kWh battery" doesn\'t mean 10 kWh of backup. Depth of discharge, efficiency losses and your actual load all reduce what you get. Most buyers find this out after installation — when it\'s too late to change anything.',
    stat: 'Use the Battery Runtime Calculator before you buy a battery.',
  },
  {
    icon: <AlertTriangle size={26} />,
    title: 'Farms and agricultural sites need special treatment',
    body: 'A borehole pump drawing 1.1 kW while running can demand 3–4 kW when it starts. If your inverter isn\'t sized for that startup surge, it will trip every single time the pump kicks on. This is one of the most common — and most preventable — agricultural solar failures.',
    stat: 'The agricultural sizing tool accounts for motor starting currents automatically.',
  },
  {
    icon: <ShieldOff size={26} />,
    title: 'Every company that reviews your quote also wants to sell you something',
    body: 'There is no such thing as a free and unbiased review from a company that sells equipment. VoltSage earns nothing from the panels, inverters or batteries you buy. Our only business is helping you get the right information — before anyone tries to sell you anything.',
    stat: 'No equipment sold. No commissions. Just engineering.',
  },
]

export default function ProblemsSection() {
  return (
    <section id="problems" className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="max-w-2xl mb-16">
          <div className="section-eyebrow">The solar industry problem</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-5">
            Six things that go wrong<br />
            <span className="brand-text">when you skip the sizing step</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Most solar problems are not caused by bad equipment or bad installers.
            They are caused by not knowing the right system size before the purchase decision is made.
            VoltSage exists to fix that — for free, before you spend a cent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 problem-card card-3d group transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(249,115,22,0.10)' }}>
                  <span className="brand-text-amber">{p.icon}</span>
                </div>
                <h3 className="font-disp font-bold text-lg text-white uppercase leading-tight pt-1">
                  {p.title}
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.body}</p>
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs font-mono text-brand-teal opacity-80">{p.stat}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-14 gradient-border rounded-2xl overflow-hidden">
          <div className="glass p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="font-disp font-bold text-2xl text-white uppercase mb-2">
                Use VoltSage before you talk to any installer.
              </h3>
              <p className="text-slate-400 text-sm">
                It takes 5 minutes. It&apos;s free. And it could save you thousands.
              </p>
            </div>
            <a
              href="#sizing"
              className="flex-shrink-0 px-8 py-3 rounded-xl font-bold font-mono uppercase tracking-wider text-dark text-sm whitespace-nowrap hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(90deg,#f97316,#eab308)' }}
            >
              Start Sizing Free →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
