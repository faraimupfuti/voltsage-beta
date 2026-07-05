'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, Trash2, Zap, Download, Info, ChevronDown } from 'lucide-react'
import {
  APPLIANCE_CATALOG, ApplianceRow, PSH_TABLE, findPSH,
  calculateResidentialSizing, SizingResult, timeToHours
} from '@/lib/calculations'

const CAT_COLORS: Record<string, string> = {
  'Lighting':                  '#06b6d4',
  'Entertainment & Electronics':'#10b981',
  'Refrigeration':             '#3b82f6',
  'Water Systems':             '#6366f1',
  'Kitchen':                   '#f97316',
  'Climate Control':           '#a855f7',
  'Laundry':                   '#8fa6bc',
  'High Power Loads':          '#ef4444',
  'Miscellaneous':             '#94a3b8',
}

const CATS = [...new Set(APPLIANCE_CATALOG.map(a => a.cat))]

let rowSeq = 0

function ReadoutCard({ label, value, unit, accent = false, amber = false }: {
  label: string; value: string; unit: string; accent?: boolean; amber?: boolean
}) {
  const color = amber ? '#f97316' : accent ? '#06b6d4' : '#10b981'
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-1">
      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</div>
      <div className="font-mono font-bold text-2xl leading-none" style={{ color }}>
        {value}
        <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
  )
}

export default function ResidentialTool() {
  const [rows, setRows] = useState<ApplianceRow[]>([])
  const [selectedCat, setSelectedCat] = useState('Lighting')
  const [selectedId, setSelectedId] = useState(APPLIANCE_CATALOG.find(a => a.cat === 'Lighting')?.id ?? '')
  const [pshId, setPshId] = useState('harare')
  const [mode, setMode] = useState<'standard' | 'advanced'>('standard')
  const [autonomy, setAutonomy] = useState(1)
  const [miscWatt, setMiscWatt] = useState(0)
  const [miscDesc, setMiscDesc] = useState('')
  const [miscFrom, setMiscFrom] = useState('06:00')
  const [miscTo, setMiscTo]     = useState('22:00')
  const [result, setResult] = useState<SizingResult | null>(null)
  const histRef = useRef<HTMLCanvasElement>(null)

  // Recalculate whenever inputs change
  useEffect(() => {
    if (rows.length === 0) { setResult(null); return }
    const psh = findPSH(pshId).psh
    const r = calculateResidentialSizing(rows, mode, psh, autonomy)
    setResult(r)
  }, [rows, pshId, mode, autonomy])

  // Draw histogram
  useEffect(() => {
    const canvas = histRef.current
    if (!canvas || !result) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    const profile = result.profile // 48 half-hour slots in Watts
    const maxW = Math.max(1, ...profile)
    const padL = 38, padB = 22, padT = 8, padR = 8
    const plotW = W - padL - padR, plotH = H - padT - padB
    const barW = plotW / 24

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padT + plotH - (i / 4) * plotH
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke()
      ctx.fillStyle = '#4b5563'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.textAlign = 'right'
      ctx.fillText(((i / 4) * maxW / 1000).toFixed(1), padL - 4, y + 3)
    }

    // Hourly bars (aggregate 2 slots)
    for (let h = 0; h < 24; h++) {
      const s1 = profile[h * 2] ?? 0
      const s2 = profile[h * 2 + 1] ?? 0
      const avg = (s1 + s2) / 2
      const barH = (avg / maxW) * plotH
      const x = padL + h * barW
      const isNight = h < 6 || h >= 18
      const grad = ctx.createLinearGradient(0, padT + plotH - barH, 0, padT + plotH)
      grad.addColorStop(0, isNight ? 'rgba(249,115,22,0.85)' : 'rgba(6,182,212,0.85)')
      grad.addColorStop(1, 'rgba(0,0,0,0.1)')
      ctx.fillStyle = grad
      ctx.fillRect(x + 1, padT + plotH - barH, Math.max(1, barW - 2), barH)
    }

    // X-axis labels every 3h
    ctx.fillStyle = '#6b7280'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center'
    for (let h = 0; h < 24; h += 3) {
      ctx.fillText(`${String(h).padStart(2,'0')}`, padL + h * barW + barW / 2, H - 6)
    }
    ctx.strokeStyle = 'rgba(6,182,212,0.2)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke()
  }, [result])

  const addAppliance = useCallback(() => {
    const a = APPLIANCE_CATALOG.find(ap => ap.id === selectedId)
    if (!a) return
    if (mode === 'standard' && rows.length >= 15) { alert('Standard mode: max 15 appliances. Switch to Advanced.'); return }
    rowSeq++
    setRows(prev => [...prev, {
      rowId: rowSeq, applianceId: selectedId, qty: 1,
      periods: [{ from: '18:00', to: '22:00' }],
    }])
  }, [selectedId, rows.length, mode])

  const addMisc = useCallback(() => {
    if (miscWatt <= 0) { alert('Enter a power rating above 0W'); return }
    rowSeq++
    setRows(prev => [...prev, {
      rowId: rowSeq, applianceId: '__misc__', qty: 1,
      periods: [{ from: miscFrom, to: miscTo }],
      miscName: miscDesc || 'Misc. load', miscWatt,
    }])
  }, [miscWatt, miscDesc, miscFrom, miscTo])

  const removeRow = (id: number) => setRows(prev => prev.filter(r => r.rowId !== id))

  const updateRow = (id: number, patch: Partial<ApplianceRow>) =>
    setRows(prev => prev.map(r => r.rowId === id ? { ...r, ...patch } : r))

  const catAppliances = APPLIANCE_CATALOG.filter(a => a.cat === selectedCat)

  return (
    <section id="sizing" className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow">Free tool — Residential & Small Commercial</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Solar Sizing Tool
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            List the appliances you want your solar system to power. Set the times they run.
            The tool builds a real 24-hour load profile and calculates your recommended inverter,
            battery and PV array — the same way an engineer performs a first-pass design.
          </p>
        </div>

        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass">
            {/* Top bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Mode</span>
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                  {(['standard', 'advanced'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${mode === m ? 'tab-active text-brand-teal' : 'text-slate-500 hover:text-slate-300'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Location</span>
                <div className="relative">
                  <select value={pshId} onChange={e => setPshId(e.target.value)}
                    className="tool-input pr-8 text-xs" style={{ minWidth: 220 }}>
                    {PSH_TABLE.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.options.map(o => (
                          <option key={o.id} value={o.id}>{o.label} — {o.psh} PSH</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/5">
              {/* LEFT — inputs */}
              <div className="p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">
                  Appliance schedule
                </h3>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATS.map(cat => (
                    <button key={cat} onClick={() => {
                      setSelectedCat(cat)
                      setSelectedId(APPLIANCE_CATALOG.find(a => a.cat === cat)?.id ?? '')
                    }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${selectedCat === cat ? 'border-brand-teal text-brand-teal bg-brand-teal/10' : 'border-white/10 text-slate-500 hover:border-white/20'}`}
                      style={{ borderLeftColor: CAT_COLORS[cat], borderLeftWidth: 3 }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Appliance selector */}
                <div className="flex gap-2 mb-4">
                  <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                    className="tool-input flex-1 text-xs">
                    {catAppliances.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} {a.type === 'power' ? `(${a.watt}W)` : `(${a.kwh} kWh/day)`}
                      </option>
                    ))}
                  </select>
                  <button onClick={addAppliance}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold hover:scale-105 transition-transform flex-shrink-0"
                    style={{ background: 'linear-gradient(90deg, #06b6d4, #10b981)' }}>
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* Row list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mb-4">
                  {rows.length === 0 && (
                    <div className="text-center py-8 text-slate-600 font-mono text-xs uppercase tracking-wider">
                      Add appliances above to start sizing ↑
                    </div>
                  )}
                  {rows.map(r => {
                    const a = APPLIANCE_CATALOG.find(ap => ap.id === r.applianceId)
                    const name = r.miscName ?? a?.name ?? 'Unknown'
                    const isEnergy = a?.type === 'energy'
                    return (
                      <div key={r.rowId}
                        className="grid grid-cols-[1fr_56px_80px_80px_32px] gap-2 items-center bg-white/3 rounded-lg px-3 py-2 text-xs">
                        <div className="font-mono text-slate-300 truncate" title={name}>
                          {a?.warn && <span className="text-red-400 mr-1">⚠</span>}
                          {a?.brief && <span className="text-amber-400 mr-1">⚡</span>}
                          {name}
                        </div>
                        <input type="number" min={1} value={r.qty}
                          onChange={e => updateRow(r.rowId, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="tool-input text-center text-xs" />
                        {isEnergy ? (
                          <div className="col-span-2 text-slate-600 font-mono text-[10px] pl-1">continuous</div>
                        ) : (
                          <>
                            <input type="time" value={r.periods[0].from}
                              onChange={e => updateRow(r.rowId, { periods: [{ ...r.periods[0], from: e.target.value }] })}
                              className="tool-input text-xs" />
                            <input type="time" value={r.periods[0].to}
                              onChange={e => updateRow(r.rowId, { periods: [{ ...r.periods[0], to: e.target.value }] })}
                              className="tool-input text-xs" />
                          </>
                        )}
                        <button onClick={() => removeRow(r.rowId)}
                          className="text-slate-600 hover:text-red-400 transition-colors flex items-center justify-center">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="text-xs font-mono text-slate-600 mb-4">
                  {rows.length} / {mode === 'standard' ? '15' : '∞'} appliances added
                </div>

                {/* Misc load */}
                <details className="rounded-xl border border-white/8 overflow-hidden">
                  <summary className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-teal cursor-pointer bg-brand-teal/5 list-none flex items-center gap-2">
                    <Plus size={12} /> Add miscellaneous load
                  </summary>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="label-mono">Description</label>
                      <input value={miscDesc} onChange={e => setMiscDesc(e.target.value)}
                        placeholder="e.g. Gate motor" className="tool-input text-xs" />
                    </div>
                    <div>
                      <label className="label-mono">Power (W)</label>
                      <input type="number" min={0} value={miscWatt}
                        onChange={e => setMiscWatt(parseFloat(e.target.value) || 0)}
                        className="tool-input text-xs" />
                    </div>
                    <div>
                      <label className="label-mono">Period</label>
                      <div className="flex gap-1">
                        <input type="time" value={miscFrom} onChange={e => setMiscFrom(e.target.value)} className="tool-input text-xs flex-1" />
                        <input type="time" value={miscTo}   onChange={e => setMiscTo(e.target.value)}   className="tool-input text-xs flex-1" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <button onClick={addMisc}
                        className="w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold"
                        style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}>
                        Add miscellaneous load
                      </button>
                    </div>
                  </div>
                </details>

                {mode === 'advanced' && (
                  <div className="mt-4">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-1">
                      Battery autonomy (days)
                    </label>
                    <input type="number" min={0.5} step={0.5} value={autonomy}
                      onChange={e => setAutonomy(parseFloat(e.target.value) || 1)}
                      className="tool-input w-32 text-xs" />
                  </div>
                )}
              </div>

              {/* RIGHT — outputs */}
              <div className="p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">
                  Results — {findPSH(pshId).label}
                </h3>

                {/* Histogram */}
                <div className="bg-black/30 rounded-xl p-3 mb-5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-600 uppercase">24-hour load profile</span>
                    <div className="flex gap-3 text-[9px] font-mono text-slate-600">
                      <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#f97316' }} />Night</span>
                      <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#06b6d4' }} />Day</span>
                    </div>
                  </div>
                  <canvas ref={histRef} width={560} height={140}
                    className="w-full h-[100px] rounded-lg" />
                  {!result && (
                    <div className="text-center text-slate-600 font-mono text-xs py-2">
                      Add appliances to see your load profile →
                    </div>
                  )}
                </div>

                {/* Readout grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <ReadoutCard label="Daily energy" value={result ? result.Ed_kWh.toFixed(2) : '—'} unit="kWh/day" accent />
                  <ReadoutCard label="Peak demand" value={result ? result.Peak_kW.toFixed(2) : '—'} unit="kW" amber />
                  <ReadoutCard label="Recommended inverter size" value={result ? String(result.invSize) : '—'} unit="kW" />
                  <ReadoutCard label="Surge withstand required" value={result ? result.Surge_kW.toFixed(2) : '—'} unit="kW" amber />
                  <ReadoutCard label="Recommended battery capacity" value={result ? result.CbattRounded.toFixed(1) : '—'} unit="kWh" accent />
                  <ReadoutCard label="Recommended PV array" value={result ? result.PpvRounded.toFixed(2) : '—'} unit="kWp" />
                </div>

                {result && (
                  <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-xl px-4 py-3 mb-5 text-xs font-mono text-slate-400">
                    ≈ {result.panelCount} panels @ 550 Wp · Battery autonomy{' '}
                    {result.autonomyHours.toFixed(1)} hrs ·{' '}
                    Night energy {result.Enight_kWh.toFixed(2)} kWh
                  </div>
                )}

                {/* Energy breakdown bar */}
                {result && (() => {
                  const total = result.Ed_kWh
                  const cats = result.catTotalsWh
                  return (
                    <div className="mb-5">
                      <div className="text-[10px] font-mono text-slate-600 uppercase mb-2">Energy breakdown</div>
                      <div className="h-3 rounded-full overflow-hidden flex bg-white/5">
                        {Object.entries(cats).map(([cat, wh]) => (
                          <div key={cat}
                            style={{ width: `${(wh / 1000 / total) * 100}%`, background: CAT_COLORS[cat] ?? '#6b7280' }}
                            title={`${cat}: ${(wh/1000).toFixed(2)} kWh`}
                            className="h-full transition-all duration-500" />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        {Object.entries(cats).map(([cat, wh]) => (
                          <span key={cat} className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: CAT_COLORS[cat] }} />
                            {cat} {(wh/1000).toFixed(1)} kWh
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                <div className="flex gap-3">
                  <a href="#contact"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                    style={{ background: 'linear-gradient(90deg, #f97316, #eab308)' }}>
                    <Zap size={13} /> Request a detailed design
                  </a>
                </div>

                <p className="text-[10px] font-mono text-slate-600 mt-4 leading-relaxed">
                  Final system sizing and equipment selection should be reviewed and verified by
                  a qualified Engineer or Solar Design Professional before installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
