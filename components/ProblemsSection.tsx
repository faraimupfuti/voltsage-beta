'use client'
import { AlertTriangle, BadgeDollarSign, HelpCircle, FileWarning, Gauge, ShieldOff } from 'lucide-react'

const PROBLEMS = [
  {
    icon: <Gauge size={28} />,
    title: 'Wrong system size — every time',
    body: 'Most installers guess. They oversize so they look generous, or undersize to win on price. Either way, you end up with a system that underperforms or drains your wallet unnecessarily.',
    stat: 'Over 60% of systems are incorrectly sized on first installation.',
  },
  {
    icon: <BadgeDollarSign size={28} />,
    title: 'You can\'t compare quotes fairly',
    body: 'One installer quotes a 3kW inverter, another quotes 5kW — for the same house. Without knowing your actual peak load and night energy, there is no way to judge which one is right.',
    stat: 'Quotes for identical homes can differ by 40% or more.',
  },
  {
    icon: <HelpCircle size={28} />,
    title: 'Jargon keeps you in the dark',
    body: 'kWp, DoD, PSH, BoQ, SLD — solar comes with a wall of acronyms designed to keep you dependent on whoever is selling. You deserve to understand what you are buying.',
    stat: 'Most buyers sign contracts without understanding 3+ key specifications.',
  },
  {
    icon: <FileWarning size={28} />,
    title: 'Battery sizing is guesswork',
    body: 'How many hours backup do you actually need? What load can your battery support? These questions have precise answers — but most people never know them before they spend $2,000–$10,000.',
    stat: 'Battery autonomy assumptions are wrong on most residential systems.',
  },
  {
    icon: <AlertTriangle size={28} />,
    title: 'Agricultural loads are completely different',
    body: 'A borehole pump or milking machine has motor starting currents 3× its rated power. Size your inverter just for running loads and it trips every time the pump kicks on.',
    stat: 'Motor-driven ag loads need surge capacity up to 3× running power.',
  },
  {
    icon: <ShieldOff size={28} />,
    title: 'No independent engineering review',
    body: 'Every company that reviews your quote also sells equipment — which means you never get truly unbiased advice. VoltSage earns nothing from equipment sales. Ever.',
    stat: 'No conflict of interest. No equipment sold. Just engineering.',
  },
]

export default function ProblemsSection() {
  return (
    <section id="problems" className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <div className="section-eyebrow">The solar industry problem</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-5">
            Six reasons people<br />
            <span className="brand-text">overpay and underperform</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            The solar installation industry is full of information gaps, misaligned incentives,
            and technical complexity that benefits sellers — not buyers.
            These tools exist to close that gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 problem-card card-3d group hover:border-white/10 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(249,115,22,0.1)' }}>
                  <span className="brand-text-amber">{p.icon}</span>
                </div>
                <h3 className="font-disp font-bold text-xl text-white uppercase leading-tight pt-1">
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
        <div className="mt-16 gradient-border rounded-2xl overflow-hidden">
          <div className="glass p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="font-disp font-bold text-2xl text-white uppercase mb-2">
                The solution is a number, not a guess.
              </h3>
              <p className="text-slate-400 text-sm">
                Use the same calculation methodology engineers use — for free, right now, in under 5 minutes.
              </p>
            </div>
            <a
              href="#sizing"
              className="flex-shrink-0 px-8 py-3 rounded-xl font-bold font-mono uppercase tracking-wider text-dark text-sm whitespace-nowrap hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}
            >
              Start Sizing Free →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
