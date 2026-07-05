'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, Trash2, Zap, ChevronDown } from 'lucide-react'
import {
  AG_ACTIVITIES, AgActivity, AgEquipmentRow, PSH_TABLE, findPSH,
  calculateAgriculturalSizing, SizingResult, APPLIANCE_CATALOG
} from '@/lib/calculations'

const ACTIVITY_ICONS: Record<string, string> = {
  'Irrigation':       '💧',
  'Dairy Farming':    '🐄',
  'Poultry Farming':  '🐓',
  'Piggery':          '🐷',
  'Greenhouse Farming':'🌱',
  'Crop Processing':  '🌾',
  'Mixed Farming':    '🚜',
}

let agSeq = 0

function ReadoutCard({ label, value, unit, accent = false, amber = false }: {
  label: string; value: string; unit: string; accent?: boolean; amber?: boolean
}) {
  const color = amber ? '#f97316' : accent ? '#06b6d4' : '#10b981'
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className="font-mono font-bold text-2xl leading-none" style={{ color }}>
        {value}<span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
  )
}

export default function AgriculturalTool() {
  const [activity, setActivity] = useState<AgActivity>('Irrigation')
  const [pshId, setPshId]       = useState('harare')
  const [autonomy, setAutonomy] = useState(1)
  const [rows, setRows]         = useState<AgEquipmentRow[]>([])
  const [selectedEqId, setSelectedEqId] = useState(AG_ACTIVITIES['Irrigation'][0].id)
  // Misc load
  const [miscName, setMiscName] = useState('')
  const [miscKW,   setMiscKW]   = useState(0)
  const [miscFrom, setMiscFrom] = useState('06:00')
  const [miscTo,   setMiscTo]   = useState('18:00')
  const [result, setResult] = useState<SizingResult | null>(null)
  const histRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (rows.length === 0) { setResult(null); return }
    const psh = findPSH(pshId).psh
    setResult(calculateAgriculturalSizing(rows, psh, autonomy))
  }, [rows, pshId, autonomy])

  useEffect(() => {
    const eq = AG_ACTIVITIES[activity]
    if (eq.length) setSelectedEqId(eq[0].id)
    setRows([])
  }, [activity])

  useEffect(() => {
    const canvas = histRef.current
    if (!canvas || !result) { if (canvas) { const c = canvas.getContext('2d'); c?.clearRect(0, 0, canvas.width, canvas.height) } return }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    const profile = result.profile
    const maxW = Math.max(1, ...profile)
    const padL = 44, padB = 22, padT = 8, padR = 8
    const plotW = W - padL - padR, plotH = H - padT - padB
    const barW = plotW / 24
    for (let i = 0; i <= 4; i++) {
      const y = padT + plotH - (i / 4) * plotH
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke()
      ctx.fillStyle = '#4b5563'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'right'
      ctx.fillText(((i / 4) * maxW / 1000).toFixed(i === 0 ? 0 : 1), padL - 4, y + 3)
    }
    for (let h = 0; h < 24; h++) {
      const avg = ((profile[h * 2] ?? 0) + (profile[h * 2 + 1] ?? 0)) / 2
      const barH = (avg / maxW) * plotH
      const x = padL + h * barW
      const isNight = h < 6 || h >= 18
      const grad = ctx.createLinearGradient(0, padT + plotH - barH, 0, padT + plotH)
      grad.addColorStop(0, isNight ? 'rgba(16,185,129,0.85)' : 'rgba(249,115,22,0.85)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad; ctx.fillRect(x + 1, padT + plotH - barH, Math.max(1, barW - 2), barH)
    }
    ctx.fillStyle = '#6b7280'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center'
    for (let h = 0; h < 24; h += 3) ctx.fillText(`${String(h).padStart(2, '0')}`, padL + h * barW + barW / 2, H - 6)
  }, [result])

  const addEquipment = useCallback(() => {
    const items = AG_ACTIVITIES[activity]
    const eq = items.find(e => e.id === selectedEqId)
    if (!eq) return
    agSeq++
    setRows(prev => [...prev, { rowId: agSeq, eqId: eq.id, name: eq.name, kw: eq.kw, surge: eq.surge, qty: 1, periods: [{ from: '06:00', to: '18:00' }] }])
  }, [activity, selectedEqId])

  const addMisc = useCallback(() => {
    if (miscKW <= 0) { alert('Enter a power rating above 0 kW'); return }
    agSeq++
    setRows(prev => [...prev, { rowId: agSeq, eqId: '__misc__', name: miscName || 'Misc. load', kw: miscKW, surge: 1, qty: 1, periods: [{ from: miscFrom, to: miscTo }] }])
  }, [miscKW, miscName, miscFrom, miscTo])

  const removeRow = (id: number) => setRows(prev => prev.filter(r => r.rowId !== id))

  const updateRow = (id: number, patch: Partial<AgEquipmentRow>) =>
    setRows(prev => prev.map(r => r.rowId === id ? { ...r, ...patch } : r))

  const eqOptions = AG_ACTIVITIES[activity]

  return (
    <section id="agricultural" className="py-24" style={{ background: 'linear-gradient(180deg, #050709 0%, #0d1117 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow">Free tool — Agricultural</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Agricultural<br />
            <span className="brand-text-teal">Solar Sizing Tool</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Farm loads are different. Borehole pumps, milking machines, and grain mills draw{' '}
            <strong className="text-white">2–3× their rated power on startup</strong>. Size wrong
            and your inverter trips every time equipment kicks on. Select your farm activity and
            the tool filters to the right equipment automatically.
          </p>
        </div>

        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass">
            {/* Activity selector */}
            <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-white/5">
              {(Object.keys(AG_ACTIVITIES) as AgActivity[]).map(act => (
                <button key={act} onClick={() => setActivity(act)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${activity === act ? 'border-brand-green text-brand-green bg-brand-green/10' : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}>
                  <span>{ACTIVITY_ICONS[act]}</span> {act}
                </button>
              ))}
            </div>

            {/* Location + autonomy bar */}
            <div className="flex flex-wrap gap-4 items-center px-6 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Location</span>
                <div className="relative">
                  <select value={pshId} onChange={e => setPshId(e.target.value)} className="tool-input text-xs pr-7" style={{ minWidth: 200 }}>
                    {PSH_TABLE.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.options.map(o => <option key={o.id} value={o.id}>{o.label} — {o.psh} PSH</option>)}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Battery autonomy</span>
                <input type="number" min={0.5} step={0.5} value={autonomy}
                  onChange={e => setAutonomy(parseFloat(e.target.value) || 1)}
                  className="tool-input text-xs w-20" />
                <span className="text-xs font-mono text-slate-600">days</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/5">
              {/* LEFT */}
              <div className="p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">Equipment schedule</h3>

                <div className="flex gap-2 mb-4">
                  <select value={selectedEqId} onChange={e => setSelectedEqId(e.target.value)} className="tool-input flex-1 text-xs">
                    {eqOptions.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.kw} kW · surge ×{eq.surge})</option>
                    ))}
                  </select>
                  <button onClick={addEquipment}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold hover:scale-105 transition-transform flex-shrink-0"
                    style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}>
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_48px_80px_80px_32px] gap-2 px-3 mb-1">
                  {['Equipment', 'Qty', 'From', 'To', ''].map((h, i) => (
                    <span key={i} className="text-[9px] font-mono uppercase text-slate-600">{h}</span>
                  ))}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-4">
                  {rows.length === 0 && (
                    <div className="text-center py-8 text-slate-600 font-mono text-xs uppercase">
                      Add equipment above to start ↑
                    </div>
                  )}
                  {rows.map(r => (
                    <div key={r.rowId} className="grid grid-cols-[1fr_48px_80px_80px_32px] gap-2 items-center bg-white/3 rounded-lg px-3 py-2 text-xs">
                      <div className="font-mono text-slate-300 truncate text-[11px]">
                        {r.name}
                        <span className="text-slate-600 ml-1">({r.kw}kW)</span>
                      </div>
                      <input type="number" min={1} value={r.qty}
                        onChange={e => updateRow(r.rowId, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="tool-input text-center text-xs" />
                      <input type="time" value={r.periods[0].from}
                        onChange={e => updateRow(r.rowId, { periods: [{ ...r.periods[0], from: e.target.value }] })}
                        className="tool-input text-xs" />
                      <input type="time" value={r.periods[0].to}
                        onChange={e => updateRow(r.rowId, { periods: [{ ...r.periods[0], to: e.target.value }] })}
                        className="tool-input text-xs" />
                      <button onClick={() => removeRow(r.rowId)} className="text-slate-600 hover:text-red-400 transition-colors flex items-center justify-center">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-mono text-slate-600 mb-4">{rows.length} equipment items added</div>

                {/* Misc load */}
                <details className="rounded-xl border border-white/8 overflow-hidden">
                  <summary className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-green cursor-pointer bg-brand-green/5 list-none flex items-center gap-2">
                    <Plus size={12} /> Add miscellaneous load (farm office, security, etc.)
                  </summary>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-mono uppercase text-slate-600 block mb-1">Description</label>
                      <input value={miscName} onChange={e => setMiscName(e.target.value)} placeholder="e.g. Farm office lights" className="tool-input text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-600 block mb-1">Power (kW)</label>
                      <input type="number" min={0} step={0.1} value={miscKW} onChange={e => setMiscKW(parseFloat(e.target.value) || 0)} className="tool-input text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-600 block mb-1">From — To</label>
                      <div className="flex gap-1">
                        <input type="time" value={miscFrom} onChange={e => setMiscFrom(e.target.value)} className="tool-input text-xs flex-1" />
                        <input type="time" value={miscTo}   onChange={e => setMiscTo(e.target.value)}   className="tool-input text-xs flex-1" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <button onClick={addMisc}
                        className="w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold"
                        style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}>
                        Add miscellaneous load
                      </button>
                    </div>
                  </div>
                </details>
              </div>

              {/* RIGHT — results */}
              <div className="p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">
                  Results — {findPSH(pshId).label}
                </h3>

                <div className="bg-black/30 rounded-xl p-3 mb-5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-600 uppercase">24-hour load profile</span>
                    <div className="flex gap-3 text-[9px] font-mono text-slate-600">
                      <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#f97316' }} />Day</span>
                      <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#10b981' }} />Night</span>
                    </div>
                  </div>
                  <canvas ref={histRef} width={560} height={140} className="w-full h-[100px] rounded-lg" />
                  {!result && <div className="text-center text-slate-600 font-mono text-xs py-2">Add equipment to see profile →</div>}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <ReadoutCard label="Daily energy"              value={result ? result.Ed_kWh.toFixed(2) : '—'}       unit="kWh/day" accent />
                  <ReadoutCard label="Maximum running demand"    value={result ? result.Peak_kW.toFixed(2) : '—'}      unit="kW"      amber />
                  <ReadoutCard label="Recommended inverter"      value={result ? String(result.invSize) : '—'}         unit="kW"      />
                  <ReadoutCard label="Maximum surge demand"      value={result ? result.Surge_kW.toFixed(2) : '—'}     unit="kW"      amber />
                  <ReadoutCard label="Recommended battery"       value={result ? result.CbattRounded.toFixed(1) : '—'}unit="kWh"     accent />
                  <ReadoutCard label="Recommended PV array"      value={result ? result.PpvRounded.toFixed(2) : '—'}  unit="kWp"     />
                </div>

                {result && (
                  <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl px-4 py-3 mb-5 text-xs font-mono text-slate-400">
                    ≈ {result.panelCount} panels @ 550 Wp ·
                    Night energy {result.Enight_kWh.toFixed(2)} kWh ·
                    Battery autonomy {result.autonomyHours.toFixed(1)} hrs
                  </div>
                )}

                <a href="#contact"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}>
                  <Zap size={13} /> Request a detailed agricultural design
                </a>

                <p className="text-[10px] font-mono text-slate-600 mt-4 leading-relaxed">
                  Inverter sized at 1.3× peak running demand to nearest standard size.
                  Motor starting currents (surge) are separate — confirm your chosen
                  inverter's surge rating exceeds the figure above.
                  Final design must be verified by a qualified engineer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
