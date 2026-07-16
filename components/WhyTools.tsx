'use client'
import { ShieldCheck, Clock, BadgeCheck, Calculator, MapPin, Gift } from 'lucide-react'

const WHY_BEFORE = [
  {
    icon: Calculator,
    color: '#f97316',
    title: 'You\'ll know exactly what size system you need',
    body: 'Without a sizing tool, you\'re guessing — or trusting the installer to guess for you. Our tool builds a real picture of how much electricity you use and when, then tells you the right inverter size, battery capacity and number of solar panels. No guessing.',
  },
  {
    icon: ShieldCheck,
    color: '#06b6d4',
    title: 'You won\'t overpay for a system that\'s too big',
    body: 'Installers often oversize systems to be "safe" — but you pay for every extra kilowatt. Knowing your actual numbers means you can push back on any quote that recommends more than you need.',
  },
  {
    icon: BadgeCheck,
    color: '#10b981',
    title: 'You won\'t be left with a system that\'s too small',
    body: 'An undersized system trips and shuts down when too many appliances run at once. Our tool calculates your peak demand and surge requirements so the system recommended can handle everything you need to run — at the same time.',
  },
  {
    icon: Clock,
    color: '#eab308',
    title: 'You can compare quotes from different installers fairly',
    body: 'When you walk in knowing you need a 5 kW inverter, 10 kWh battery and 8 kWp of panels — you can compare every quote on the same terms. Without those numbers, you\'re comparing apples to oranges.',
  },
  {
    icon: MapPin,
    color: '#a855f7',
    title: 'Your system is sized for your actual location',
    body: 'Solar performs differently in Bulawayo versus Manicaland, in Egypt versus Ghana. Our tools use real peak sun hour data for your exact province or country — so the numbers match your reality, not a generic average.',
  },
  {
    icon: Gift,
    color: '#ec4899',
    title: 'It\'s completely free — no strings attached',
    body: 'Residential sizing, agricultural sizing, battery runtime — all free, forever. We don\'t sell equipment and we don\'t earn a commission on what you buy. Our only goal is to make sure you have the right information before you spend your money.',
  },
]

const TOOL_CARDS = [
  {
    name: 'Residential & Small Commercial Sizing Tool',
    who: 'For homeowners, landlords, offices, shops and small businesses',
    what: 'Add the appliances you want to power and the times they run. The tool builds a 24-hour load profile and tells you the recommended inverter size, battery capacity and PV array — the same way an engineer does a first-pass design.',
    href: '#sizing',
    color: '#06b6d4',
    cta: 'Size my home or office →',
  },
  {
    name: 'Agricultural Solar Sizing Tool',
    who: 'For farmers, irrigation schemes, poultry farms, dairy operations and crop processors',
    what: 'Farm equipment like borehole pumps and milking machines draw 2–3× their rated power on startup. This tool accounts for that and gives you the right inverter and PV size for your specific farm activity.',
    href: '#agricultural',
    color: '#10b981',
    cta: 'Size my farm →',
  },
  {
    name: 'Battery Runtime Calculator',
    who: 'For anyone who wants to know how long their battery will last',
    what: 'Enter your battery size, how deeply it can be discharged, its efficiency, and the load you plan to run. The tool tells you exactly how many hours of backup you\'ll get — before you spend money on a battery.',
    href: '#battery',
    color: '#f97316',
    cta: 'Calculate my runtime →',
  },
]

export default function WhyTools() {
  return (
    <>
      {/* ── Why before you buy ── */}
      <section id="why" className="py-24" style={{ background: 'linear-gradient(180deg,#050709 0%,#0d1117 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="section-eyebrow justify-center">Use VoltSage first — before you buy anything</div>
            <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-5">
              Why you should size your<br />
              <span className="brand-text">system before you buy it</span>
            </h2>
            <p className="text-slate-400 text-lg">
              A solar system is a major investment — often $2,000 to $20,000 or more.
              Buying the wrong size is a mistake that costs you money and doesn&apos;t get fixed easily.
              Here&apos;s what you gain by sizing your system first.
            </p>
          </div>

          {/* Before you buy strip */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-brand-amber/30 bg-brand-amber/5">
              <span className="text-brand-amber text-xl">💡</span>
              <span className="font-mono text-sm text-slate-300 uppercase tracking-wider">
                Come to VoltSage <strong className="text-white">first</strong> — then talk to installers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_BEFORE.map((b, i) => (
              <div key={i} className="group glass rounded-2xl p-6 card-3d overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, ${b.color}, transparent)` }} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${b.color}18` }}>
                    <b.icon size={20} style={{ color: b.color }} />
                  </div>
                  <h3 className="font-disp font-bold text-base text-white uppercase leading-tight">{b.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our three free tools ── */}
      <section className="py-24 bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="section-eyebrow">Three free tools — use them all</div>
            <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
              What VoltSage<br />
              <span className="brand-text">gives you for free</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              No account. No payment. No sales call first. Just open the tool,
              enter your details, and get the numbers you need — in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TOOL_CARDS.map((t, i) => (
              <div key={i} className="gradient-border rounded-2xl overflow-hidden card-3d">
                <div className="glass p-6 h-full flex flex-col">
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: t.color }}>{t.who}</div>
                  <h3 className="font-disp font-bold text-xl text-white uppercase mb-3">{t.name}</h3>
                  <p className="text-slate-400 text-sm flex-1 mb-6 leading-relaxed">{t.what}</p>
                  <a href={t.href}
                    className="flex items-center justify-center py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                    style={{ background: `linear-gradient(90deg, ${t.color}, ${i === 0 ? '#10b981' : i === 1 ? '#06b6d4' : '#eab308'})` }}>
                    {t.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Essential callout */}
          <div className="mt-12 glass rounded-2xl p-8 border border-brand-teal/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-disp font-bold text-2xl text-white uppercase mb-3">
                  Why is it <span className="brand-text-teal">essential</span> to use these tools before you buy?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Solar systems are not like buying a phone or appliance where you can return it if it
                  doesn&apos;t work. Once panels are on your roof and an inverter is wired in,
                  fixing the wrong size means spending more money.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The sizing tools take your actual appliances, your actual schedule, and your actual
                  location — and turn that into the correct system size. That number is your protection
                  when you go out to get quotes.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  'Wrong inverter size = system trips every time the pump starts',
                  'Wrong battery size = runs out of power at 2am every night',
                  'Wrong PV array size = battery never fully charges in winter',
                  'Right size = system works reliably, every day, for 15+ years',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-[10px] font-bold"
                      style={{ background: i === 3 ? 'linear-gradient(135deg,#10b981,#06b6d4)' : 'rgba(239,68,68,0.15)', color: i === 3 ? '#050709' : '#ef4444' }}>
                      {i === 3 ? '✓' : '✕'}
                    </span>
                    <p className={`text-sm font-mono ${i === 3 ? 'text-brand-green font-semibold' : 'text-slate-400'}`}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
