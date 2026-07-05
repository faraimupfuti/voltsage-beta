'use client'
import { useState, useMemo } from 'react'
import { Battery, BatteryFull, Clock, Zap } from 'lucide-react'
import { calculateBatteryRuntime } from '@/lib/calculations'

function RingGauge({ pct, color, label, value, unit }: {
  pct: number; color: string; label: string; value: string; unit: string
}) {
  const R = 54, circ = 2 * Math.PI * R
  const offset = circ * (1 - Math.min(pct, 1))
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg width={136} height={136} viewBox="0 0 136 136" className="ring-svg">
          <circle className="ring-track" cx={68} cy={68} r={R} />
          <circle className="ring-fill" cx={68} cy={68} r={R}
            style={{ stroke: color, strokeDasharray: circ, strokeDashoffset: offset }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-mono font-bold text-2xl leading-none" style={{ color }}>{value}</div>
          <div className="font-mono text-xs text-slate-500 mt-1">{unit}</div>
        </div>
      </div>
      <div className="text-xs font-mono uppercase tracking-wider text-slate-500 text-center">{label}</div>
    </div>
  )
}

export default function BatteryRuntimeTool() {
  const [capacity, setCapacity]  = useState(5)
  const [dod,      setDod]       = useState(80)
  const [eff,      setEff]       = useState(95)
  const [load,     setLoad]      = useState(1.0)

  const result = useMemo(() => calculateBatteryRuntime(capacity, dod, eff, load), [capacity, dod, eff, load])

  // Max reasonable runtime for ring scale = 24h
  const MAX_HRS = 24
  const runtimePct   = result.runtimeHours / MAX_HRS
  const usablePct    = result.usableKWh / Math.max(capacity, 0.1)

  return (
    <section id="battery" className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow">Free tool — Battery Runtime</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Battery Runtime<br />
            <span className="brand-text-amber">Calculator</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            How long will your battery actually last? Enter the battery size, depth of discharge,
            efficiency and the load you plan to run. The answer updates instantly.
            No guessing, no "it depends" — just your number.
          </p>
        </div>

        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/5">
            {/* LEFT — inputs */}
            <div className="p-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6">Battery parameters</h3>

              <div className="space-y-6">
                {/* Capacity slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-mono text-slate-300">Battery capacity</label>
                    <span className="font-mono text-brand-amber font-bold">{capacity} kWh</span>
                  </div>
                  <input type="range" min={1} max={100} step={0.5} value={capacity}
                    onChange={e => setCapacity(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#f97316', background: `linear-gradient(to right, #f97316 ${capacity}%, rgba(255,255,255,0.1) ${capacity}%)` }} />
                  <div className="flex justify-between mt-1 text-[10px] font-mono text-slate-600">
                    <span>1 kWh</span><span>100 kWh</span>
                  </div>
                </div>

                {/* DoD */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div>
                      <label className="text-sm font-mono text-slate-300">Depth of discharge (DoD)</label>
                      <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                        Lithium = 80% · Lead-acid = 50%
                      </p>
                    </div>
                    <span className="font-mono text-brand-teal font-bold">{dod}%</span>
                  </div>
                  <input type="range" min={10} max={100} step={5} value={dod}
                    onChange={e => setDod(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#06b6d4', background: `linear-gradient(to right, #06b6d4 ${dod}%, rgba(255,255,255,0.1) ${dod}%)` }} />
                </div>

                {/* Efficiency */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div>
                      <label className="text-sm font-mono text-slate-300">Battery efficiency</label>
                      <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                        Lithium = 95% · Lead-acid = 80–85%
                      </p>
                    </div>
                    <span className="font-mono text-brand-green font-bold">{eff}%</span>
                  </div>
                  <input type="range" min={60} max={100} step={1} value={eff}
                    onChange={e => setEff(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#10b981', background: `linear-gradient(to right, #10b981 ${eff - 60}%, rgba(255,255,255,0.1) ${eff - 60}%)` }} />
                </div>

                {/* Load */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div>
                      <label className="text-sm font-mono text-slate-300">Connected load</label>
                      <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                        Everything switched on simultaneously
                      </p>
                    </div>
                    <span className="font-mono text-brand-amber font-bold">{load.toFixed(1)} kW</span>
                  </div>
                  <input type="range" min={0.1} max={30} step={0.1} value={load}
                    onChange={e => setLoad(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#f97316', background: `linear-gradient(to right, #f97316 ${(load / 30) * 100}%, rgba(255,255,255,0.1) ${(load / 30) * 100}%)` }} />
                  <div className="flex justify-between mt-1 text-[10px] font-mono text-slate-600">
                    <span>0.1 kW</span><span>30 kW</span>
                  </div>
                </div>
              </div>

              {/* Manual inputs */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Capacity (kWh)', val: capacity, set: setCapacity, min: 0.5, step: 0.5 },
                  { label: 'Load (kW)',      val: load,     set: setLoad,     min: 0.1, step: 0.1 },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] font-mono uppercase text-slate-600 block mb-1">{f.label}</label>
                    <input type="number" min={f.min} step={f.step} value={f.val}
                      onChange={e => f.set(parseFloat(e.target.value) || f.min)}
                      className="tool-input text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — results */}
            <div className="p-8 flex flex-col items-center justify-center">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-8 self-start">Results</h3>

              {/* Ring gauges */}
              <div className="flex flex-wrap justify-center gap-10 mb-10">
                <RingGauge
                  pct={runtimePct}
                  color="#f97316"
                  label="Runtime at this load"
                  value={result.runtimeHours >= 24 ? '24+' : result.runtimeHours.toFixed(1)}
                  unit="hours"
                />
                <RingGauge
                  pct={usablePct}
                  color="#06b6d4"
                  label="Usable energy"
                  value={result.usableKWh.toFixed(2)}
                  unit="kWh"
                />
              </div>

              {/* Formula explanation */}
              <div className="w-full bg-black/30 rounded-2xl border border-white/5 p-5 mb-6">
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-3">How it's calculated</div>
                <div className="space-y-2 font-mono text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Rated capacity</span>
                    <span className="text-white">{capacity} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>× DoD ({dod}%)</span>
                    <span className="text-white">{(capacity * dod / 100).toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>× efficiency ({eff}%)</span>
                    <span className="text-brand-teal font-bold">{result.usableKWh.toFixed(2)} kWh usable</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between">
                    <span>÷ load ({load.toFixed(1)} kW)</span>
                    <span className="text-brand-amber font-bold">{result.runtimeHours.toFixed(1)} hours</span>
                  </div>
                </div>
              </div>

              {/* Context table */}
              <div className="w-full bg-white/3 rounded-xl p-4 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2 mb-3">
                  <Battery size={14} className="text-brand-teal" />
                  <span className="uppercase tracking-wider">Common reference loads</span>
                </div>
                {[
                  { label: 'Fridge + 6 LED lights + TV', kw: 0.65 },
                  { label: '2 ACs + fridge + lights',    kw: 2.8  },
                  { label: 'Borehole pump (1.1 kW)',      kw: 1.1  },
                  { label: 'Home office (laptop + lights)',kw: 0.2  },
                ].map(ref => (
                  <div key={ref.label} className="flex justify-between items-center py-1 border-b border-white/5">
                    <span>{ref.label}</span>
                    <span className="text-white">{(result.usableKWh / ref.kw).toFixed(1)} hrs</span>
                  </div>
                ))}
              </div>

              <a href="#contact"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}>
                <Zap size={13} /> Get a battery design from an engineer
              </a>
            </div>
          </div>
        </div>

        {/* Explanation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: <Battery size={22} />, title: 'What is DoD?', body: 'Depth of Discharge is how far you can run a battery down before damage occurs. A 5kWh lithium battery at 80% DoD gives you 4kWh — not 5kWh.' },
            { icon: <BatteryFull size={22} />, title: 'What is efficiency?', body: 'Not all energy going in comes back out. At 95% efficiency, for every 1kWh you store, you get 0.95kWh back. The rest is lost as heat.' },
            { icon: <Clock size={22} />, title: 'What is runtime?', body: 'Runtime is usable energy divided by your connected load. Halve your load, double your runtime. Simple — but most people never calculate it before they buy.' },
          ].map((c, i) => (
            <div key={i} className="glass rounded-xl p-5 card-3d">
              <div className="text-brand-teal mb-3">{c.icon}</div>
              <h4 className="font-disp font-bold text-base uppercase text-white mb-2">{c.title}</h4>
              <p className="text-slate-400 text-sm">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
