'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const ARTICLES = [
  {
    title: 'How to size a solar system correctly',
    tag: 'Solar basics',
    body: `Most people start with "I need backup for 8 hours" — but that's the wrong starting point. The right starting point is your actual appliance list and the times those appliances run.\n\nThe tool on this site builds a 24-hour load profile from your schedule. It separates your night energy (18:00–06:00) from your daytime energy, because those are sized differently:\n\n• Your battery is sized to cover night-time energy — not your entire daily total.\n• Your PV array is sized to run daytime appliances directly AND recharge the battery for the night ahead.\n\nSize the battery off total daily energy and you'll buy a battery twice as big as you need. This is one of the most common sizing mistakes in the industry.`,
  },
  {
    title: 'Why do solar quotes vary so much for the same house?',
    tag: 'Buying smart',
    body: `Two honest installers, one house, quotes differing by 40%. Both can be right — because they're specifying different equipment tiers and different system sizes.\n\nThe only way to compare quotes fairly is to know what your load actually requires — then check each quote against that number.\n\nThat's what the sizing tool does. Run it first, then evaluate every quote against the output. If a quote comes in well below the calculated PV or battery requirement, ask why. If it comes in much higher, ask the same question.`,
  },
  {
    title: 'Understanding battery technologies',
    tag: 'Batteries',
    body: `Lithium (LiFePO4) vs lead-acid — the key differences that affect your sizing:\n\n• Depth of discharge: Lithium tolerates 80% daily. Lead-acid should be limited to 50% to avoid rapid degradation.\n• Round-trip efficiency: Lithium ~95%, lead-acid 80–85%. This means more of your solar energy actually reaches your appliances.\n• Cycle life: Lithium handles 2,000–4,000 cycles. Lead-acid: 300–700 cycles at 50% DoD.\n\nPractically: a 5kWh lithium battery gives you 4kWh of usable energy, day after day, for 10+ years. A 5kWh lead-acid battery gives you 2.5kWh, and degrades faster. The upfront price difference is usually justified.`,
  },
  {
    title: 'Agricultural solar: why motor loads are different',
    tag: 'Agricultural',
    body: `A borehole pump rated at 1.1kW doesn't start at 1.1kW. It starts at 3–3.5kW for a fraction of a second before settling to its running power. This is called inrush current.\n\nIf your inverter is sized only for running loads, it will trip every time the pump starts. This is one of the most common agricultural solar failures — and it's entirely preventable.\n\nThe agricultural sizing tool applies a surge multiplier (3× for pumps, 2.5× for fans and mills) and calculates the separate surge demand your inverter must handle. The recommended inverter size is always based on continuous running load × 1.3 — but the surge figure tells you what the inverter's peak rating must exceed.`,
  },
  {
    title: 'Common solar sizing mistakes',
    tag: 'Solar basics',
    body: `1. Sizing battery off total daily energy instead of night-time energy only — results in a battery 30–60% too large and significantly oversized PV.\n\n2. Not accounting for motor starting surge — inverter trips on pump or compressor startup.\n\n3. Using a flat "average household" daily kWh instead of a real appliance schedule — misses load shape entirely.\n\n4. Ignoring peak sun hours for the actual location — a system sized for 5.5h/day in Harare has the same array as one in Manicaland (4.8h PSH) but will underperform by 15%.\n\n5. Buying an inverter sized only for peak demand without a 30% safety margin — trips under load combinations the installer never modelled.`,
  },
  {
    title: 'Generator vs. solar — the real economics',
    tag: 'Economics',
    body: `A generator costs less upfront but more per kWh — every hour it runs costs fuel, maintenance, and noise.\n\nSolar has a high upfront cost and near-zero marginal cost per kWh. The crossover point depends on how many hours a day you'd run a generator instead.\n\nFor context: running a 3kVA generator 8 hours/day in Zimbabwe at current diesel prices costs roughly $150–200/month in fuel alone — before servicing. A correctly sized solar system costing $3,000 pays back that fuel cost in 15–20 months, then runs for free for 15+ years.\n\nThe sizing tool gives you the numbers. The economics are often more obvious once you see an accurate system size rather than a vague quote.`,
  },
]

export default function ArticlesSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="articles" className="py-24" style={{ background: 'linear-gradient(180deg, #050709 0%, #0d1117 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="section-eyebrow">VoltSage Learn</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Read before you<br />
            <span className="brand-text">talk to any installer</span>
          </h2>
          <p className="text-slate-400 text-base">
            Six short reads covering the questions we get asked most.
            Written to help you ask better questions — not to sell you anything.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {ARTICLES.map((a, i) => (
            <div key={i} className={`glass rounded-2xl overflow-hidden border transition-all duration-300 ${open === i ? 'border-brand-teal/30' : 'border-white/5 hover:border-white/10'}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest border"
                    style={{ borderColor: 'rgba(6,182,212,0.3)', color: '#06b6d4', background: 'rgba(6,182,212,0.08)' }}>
                    {a.tag}
                  </span>
                  <h3 className="font-disp font-bold text-lg text-white uppercase group-hover:text-brand-teal transition-colors">
                    {a.title}
                  </h3>
                </div>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-slate-500 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <div className="h-px bg-white/5 mb-5" />
                  {a.body.split('\n\n').map((para, j) => (
                    <p key={j} className="text-slate-400 text-sm leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
