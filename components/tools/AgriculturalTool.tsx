'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, Trash2, Zap, Clock, X, ChevronDown } from 'lucide-react'
import {
  AG_ACTIVITIES, AgActivity, AgEquipmentRow,
  PSH_TABLE, findPSH,
  calculateAgriculturalSizing, SizingResult,
} from '@/lib/calculations'

const ACTIVITY_ICONS: Record<string, string> = {
  'Irrigation':        '💧',
  'Dairy Farming':     '🐄',
  'Poultry Farming':   '🐓',
  'Piggery':           '🐷',
  'Greenhouse Farming':'🌱',
  'Crop Processing':   '🌾',
  'Mixed Farming':     '🚜',
}

let agSeq = 0

/* ── shared label ── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 select-none">
      {children}
    </span>
  )
}

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

/* ── histogram (shared logic, labelled axes) ── */
function drawHistogram(canvas: HTMLCanvasElement, profile: number[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width, H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const maxW  = Math.max(1, ...profile)
  const padL  = 50, padB = 34, padT = 14, padR = 14
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const barW  = plotW / 24

  /* grid + y-axis labels */
  const ySteps = 5
  for (let i = 0; i <= ySteps; i++) {
    const val = (i / ySteps) * maxW
    const y   = padT + plotH - (i / ySteps) * plotH
    ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'
    ctx.lineWidth   = i === 0 ? 1.2 : 0.7
    ctx.setLineDash(i === 0 ? [] : [3, 4])
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke()
    ctx.setLineDash([])
    const label = val >= 1000 ? `${(val / 1000).toFixed(1)}` : `${Math.round(val)}`
    ctx.fillStyle = '#6b7280'; ctx.font = '9px JetBrains Mono,monospace'
    ctx.textAlign = 'right'; ctx.fillText(label, padL - 5, y + 3.5)
  }

  /* y-axis title */
  ctx.save()
  ctx.translate(10, padT + plotH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.font = '9px JetBrains Mono,monospace'; ctx.fillStyle = '#4b5563'; ctx.textAlign = 'center'
  ctx.fillText('kW', 0, 0)
  ctx.restore()

  /* hourly bars */
  for (let h = 0; h < 24; h++) {
    const avg  = ((profile[h * 2] ?? 0) + (profile[h * 2 + 1] ?? 0)) / 2
    const barH = (avg / maxW) * plotH
    const x    = padL + h * barW
    const isNight = h < 6 || h >= 18
    const grad = ctx.createLinearGradient(0, padT + plotH - barH, 0, padT + plotH)
    grad.addColorStop(0, isNight ? 'rgba(16,185,129,0.85)' : 'rgba(249,115,22,0.85)')
    grad.addColorStop(1, 'rgba(0,0,0,0.05)')
    ctx.fillStyle = grad
    ctx.fillRect(x + 1, padT + plotH - barH, Math.max(1, barW - 2), barH)
  }

  /* x-axis labels every 3 h */
  ctx.fillStyle = '#6b7280'; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'center'
  for (let h = 0; h < 24; h += 3) {
    ctx.fillText(`${String(h).padStart(2, '0')}:00`, padL + h * barW + barW / 2, padT + plotH + 12)
  }

  /* x-axis title */
  ctx.font = '9px JetBrains Mono,monospace'; ctx.fillStyle = '#4b5563'; ctx.textAlign = 'center'
  ctx.fillText('Hour of day', padL + plotW / 2, padT + plotH + 28)

  /* axis lines */
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH + 1); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke()
}

/* ═══════════════════════════════════════════════════════════ */
export default function AgriculturalTool() {
  const [activity, setActivity] = useState<AgActivity>('Irrigation')
  const [pshId,    setPshId]    = useState('harare')
  const [autonomy, setAutonomy] = useState(1)
  const [mode,     setMode]     = useState<'standard' | 'advanced'>('standard')
  const [rows,     setRows]     = useState<AgEquipmentRow[]>([])
  const [selectedEqId, setSelectedEqId] = useState(AG_ACTIVITIES['Irrigation'][0].id)
  /* misc */
  const [miscName, setMiscName] = useState('')
  const [miscKW,   setMiscKW]   = useState(0)
  const [miscFrom, setMiscFrom] = useState('06:00')
  const [miscTo,   setMiscTo]   = useState('18:00')

  const [result, setResult] = useState<SizingResult | null>(null)
  const histRef = useRef<HTMLCanvasElement>(null)

  /* recalculate */
  useEffect(() => {
    if (rows.length === 0) { setResult(null); return }
    setResult(calculateAgriculturalSizing(rows, mode, findPSH(pshId).psh, autonomy))
  }, [rows, pshId, autonomy, mode])

  /* draw histogram */
  useEffect(() => {
    if (!histRef.current) return
    if (!result) { histRef.current.getContext('2d')?.clearRect(0, 0, 600, 180); return }
    drawHistogram(histRef.current, result.profile)
  }, [result])

  /* reset rows when activity changes */
  useEffect(() => {
    const eq = AG_ACTIVITIES[activity]
    if (eq.length) setSelectedEqId(eq[0].id)
    setRows([])
  }, [activity])

  /* ── row helpers ── */
  const addEquipment = useCallback(() => {
    const items = AG_ACTIVITIES[activity]
    const eq    = items.find(e => e.id === selectedEqId)
    if (!eq) return
    agSeq++
    setRows(prev => [...prev, {
      rowId: agSeq, eqId: eq.id, name: eq.name,
      kw: eq.kw, surge: eq.surge, qty: 1,
      periods: [{ from: '06:00', to: '18:00' }],
      customKW: null,
    }])
  }, [activity, selectedEqId])

  const addMisc = useCallback(() => {
    if (miscKW <= 0) { alert('Enter a power rating above 0 kW.'); return }
    agSeq++
    setRows(prev => [...prev, {
      rowId: agSeq, eqId: '__misc__',
      name: miscName || 'Misc. load',
      kw: miscKW, surge: 1, qty: 1,
      periods: [{ from: miscFrom, to: miscTo }],
      customKW: null,
    }])
  }, [miscKW, miscName, miscFrom, miscTo])

  const removeRow = (id: number) => setRows(prev => prev.filter(r => r.rowId !== id))

  const updateRow = (id: number, patch: Partial<AgEquipmentRow>) =>
    setRows(prev => prev.map(r => r.rowId === id ? { ...r, ...patch } : r))

  const addPeriod = (id: number) =>
    setRows(prev => prev.map(r =>
      r.rowId === id ? { ...r, periods: [...r.periods, { from: '06:00', to: '08:00' }] } : r
    ))

  const removePeriod = (id: number, idx: number) =>
    setRows(prev => prev.map(r =>
      r.rowId === id ? { ...r, periods: r.periods.filter((_, i) => i !== idx) } : r
    ))

  const updatePeriod = (id: number, idx: number, field: 'from' | 'to', val: string) =>
    setRows(prev => prev.map(r => {
      if (r.rowId !== id) return r
      const periods = r.periods.map((p, i) => i === idx ? { ...p, [field]: val } : p)
      return { ...r, periods }
    }))

  const eqOptions = AG_ACTIVITIES[activity]

  return (
    <section id="agricultural" className="py-24"
      style={{ background: 'linear-gradient(180deg,#050709 0%,#0d1117 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow">Free tool — Agricultural</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Agricultural<br />
            <span className="brand-text-teal">Solar Sizing Tool</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Farm loads are different. Pumps, milking machines and grain mills draw{' '}
            <strong className="text-white">2–3× their rated power on startup</strong>.
            Select your farm activity — the equipment list filters automatically.
            Sizes your inverter, battery and PV array the same way an engineer would.
          </p>
        </div>

        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass">

            {/* ── activity tabs ── */}
            <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-white/5">
              {(Object.keys(AG_ACTIVITIES) as AgActivity[]).map(act => (
                <button
                  key={act}
                  onClick={() => setActivity(act)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                    activity === act
                      ? 'border-brand-green text-brand-green bg-brand-green/10'
                      : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                  }`}
                >
                  <span>{ACTIVITY_ICONS[act]}</span> {act}
                </button>
              ))}
            </div>

            {/* ── mode + location + autonomy bar ── */}
            <div className="flex flex-wrap gap-4 items-center px-6 py-3 border-b border-white/5">

              {/* Standard / Advanced */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Mode</span>
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                  {(['standard', 'advanced'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                        mode === m
                          ? 'bg-brand-green/15 text-brand-green'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {mode === 'advanced' && (
                  <span className="text-[10px] font-mono text-brand-amber opacity-80">
                    Power override &amp; multiple periods unlocked
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Location</span>
                <div className="relative">
                  <select
                    value={pshId}
                    onChange={e => setPshId(e.target.value)}
                    className="tool-input text-xs pr-7"
                    style={{ minWidth: 200 }}
                  >
                    {PSH_TABLE.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.options.map(o => (
                          <option key={o.id} value={o.id}>{o.label} — {o.psh} PSH</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* ── main body ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/5">

              {/* ──────────── LEFT: inputs ──────────── */}
              <div className="p-6 flex flex-col gap-5">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Equipment schedule
                </h3>

                {/* Equipment selector */}
                <div className="flex gap-2">
                  <select
                    value={selectedEqId}
                    onChange={e => setSelectedEqId(e.target.value)}
                    className="tool-input flex-1 text-xs"
                  >
                    {eqOptions.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} ({eq.kw} kW)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addEquipment}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold hover:scale-105 transition-transform flex-shrink-0"
                    style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4)' }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* Column headers */}
                {rows.length > 0 && (
                  <div className="grid gap-2 px-1"
                    style={{ gridTemplateColumns: '1fr 56px 80px 80px 32px' }}>
                    <Label>Equipment</Label>
                    <Label>Qty</Label>
                    <Label>From</Label>
                    <Label>To</Label>
                    <span />
                  </div>
                )}

                {/* Equipment rows */}
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                  {rows.length === 0 && (
                    <div className="text-center py-10 text-slate-600 font-mono text-xs uppercase tracking-wider">
                      Add equipment above to start ↑
                    </div>
                  )}

                  {rows.map(r => {
                    const defaultKW = r.kw

                    return (
                      <div
                        key={r.rowId}
                        className="rounded-xl bg-white/3 border border-white/5 p-3 flex flex-col gap-2"
                      >
                        {/* Main row */}
                        <div className="grid gap-2 items-center"
                          style={{ gridTemplateColumns: '1fr 56px 80px 80px 32px' }}>

                          {/* Name */}
                          <div className="font-mono text-[11px] text-slate-200 truncate" title={r.name}>
                            {r.name}
                            <span className="text-slate-600 ml-1 text-[10px]">
                              ({mode === 'advanced' && r.customKW ? r.customKW : defaultKW} kW)
                            </span>
                          </div>

                          {/* Qty — explicit white text so it's always visible */}
                          <input
                            type="number" min={1} value={r.qty}
                            onChange={e => updateRow(r.rowId, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="tool-input text-center text-xs font-mono"
                            style={{ color: '#f1f5f9' }}
                          />

                          {/* From */}
                          <input
                            type="time" value={r.periods[0]?.from ?? '06:00'}
                            onChange={e => updatePeriod(r.rowId, 0, 'from', e.target.value)}
                            className="tool-input text-xs"
                            style={{ color: '#f1f5f9' }}
                          />

                          {/* To */}
                          <input
                            type="time" value={r.periods[0]?.to ?? '18:00'}
                            onChange={e => updatePeriod(r.rowId, 0, 'to', e.target.value)}
                            className="tool-input text-xs"
                            style={{ color: '#f1f5f9' }}
                          />

                          {/* Remove */}
                          <button
                            onClick={() => removeRow(r.rowId)}
                            className="text-slate-600 hover:text-red-400 transition-colors flex items-center justify-center"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* ── Advanced extras ── */}
                        {mode === 'advanced' && (
                          <div className="flex flex-col gap-2 pl-2 border-l-2 border-brand-green/20">

                            {/* Custom power rating */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <Label>Custom power rating (kW)</Label>
                              <input
                                type="number"
                                min={0.1} step={0.1}
                                placeholder={String(defaultKW)}
                                value={r.customKW ?? ''}
                                onChange={e => {
                                  const v = e.target.value === '' ? null : parseFloat(e.target.value)
                                  updateRow(r.rowId, { customKW: v })
                                }}
                                className="tool-input text-xs w-24"
                                style={{ color: '#f1f5f9' }}
                              />
                              {r.customKW && (
                                <span className="text-[10px] font-mono text-brand-amber">
                                  override: {r.customKW} kW (default {defaultKW} kW)
                                </span>
                              )}
                            </div>

                            {/* Additional periods */}
                            {r.periods.slice(1).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-2 flex-wrap">
                                <Label>Period {idx + 2}</Label>
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-[10px] font-mono text-slate-500">From</span>
                                  <input
                                    type="time" value={p.from}
                                    onChange={e => updatePeriod(r.rowId, idx + 1, 'from', e.target.value)}
                                    className="tool-input text-xs w-24"
                                    style={{ color: '#f1f5f9' }}
                                  />
                                  <span className="text-[10px] font-mono text-slate-500">To</span>
                                  <input
                                    type="time" value={p.to}
                                    onChange={e => updatePeriod(r.rowId, idx + 1, 'to', e.target.value)}
                                    className="tool-input text-xs w-24"
                                    style={{ color: '#f1f5f9' }}
                                  />
                                  <button
                                    onClick={() => removePeriod(r.rowId, idx + 1)}
                                    className="text-slate-600 hover:text-red-400 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              onClick={() => addPeriod(r.rowId)}
                              className="self-start flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border border-brand-green/30 text-brand-green hover:bg-brand-green/10 transition-all"
                            >
                              <Clock size={11} /> Add another period
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="text-xs font-mono text-slate-600">
                  {rows.length} equipment items added
                </div>

                {/* ── Miscellaneous load ── */}
                <details className="rounded-xl border border-white/8 overflow-hidden">
                  <summary className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-green cursor-pointer bg-brand-green/5 list-none flex items-center gap-2">
                    <Plus size={12} /> Add miscellaneous load (farm office, security, etc.)
                  </summary>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Description</Label>
                      <input
                        value={miscName}
                        onChange={e => setMiscName(e.target.value)}
                        placeholder="e.g. Farm office lights"
                        className="tool-input text-xs"
                      />
                    </div>
                    <div>
                      <Label>Power rating (kW)</Label>
                      <input
                        type="number" min={0} step={0.1} value={miscKW}
                        onChange={e => setMiscKW(parseFloat(e.target.value) || 0)}
                        className="tool-input text-xs"
                        style={{ color: '#f1f5f9' }}
                      />
                    </div>
                    <div>
                      <Label>Time of use</Label>
                      <div className="flex gap-1">
                        <div className="flex-1">
                          <Label>From</Label>
                          <input
                            type="time" value={miscFrom}
                            onChange={e => setMiscFrom(e.target.value)}
                            className="tool-input text-xs"
                            style={{ color: '#f1f5f9' }}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>To</Label>
                          <input
                            type="time" value={miscTo}
                            onChange={e => setMiscTo(e.target.value)}
                            className="tool-input text-xs"
                            style={{ color: '#f1f5f9' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <button
                        onClick={addMisc}
                        className="w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold"
                        style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4)' }}
                      >
                        Add miscellaneous load
                      </button>
                    </div>
                  </div>
                </details>
              </div>

              {/* ──────────── RIGHT: outputs ──────────── */}
              <div className="p-6 flex flex-col gap-5">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Results — {findPSH(pshId).label}
                </h3>

                {/* Histogram */}
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      24-hour load profile
                    </span>
                    <div className="flex gap-3 text-[9px] font-mono text-slate-500">
                      <span>
                        <span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle" style={{ background: '#f97316' }} />
                        Day (06:00–18:00)
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle" style={{ background: '#10b981' }} />
                        Night (18:00–06:00)
                      </span>
                    </div>
                  </div>
                  <canvas
                    ref={histRef}
                    width={560} height={180}
                    className="w-full rounded-lg"
                    style={{ height: 130 }}
                  />
                  {!result && (
                    <div className="text-center text-slate-600 font-mono text-xs py-2">
                      Add equipment to see load profile →
                    </div>
                  )}
                </div>

                {/* Readout grid — surge shown next to inverter size */}
                <div className="grid grid-cols-2 gap-3">
                  <ReadoutCard label="Daily energy"                 value={result ? result.Ed_kWh.toFixed(2)       : '—'} unit="kWh/day" accent />
                  <ReadoutCard label="Maximum running demand"       value={result ? result.Peak_kW.toFixed(2)      : '—'} unit="kW"      amber />
                  <ReadoutCard label="Recommended inverter size"    value={result ? String(result.invSize)         : '—'} unit="kW" />
                  <ReadoutCard label="Recommended surge withstand"  value={result ? result.Surge_kW.toFixed(2)     : '—'} unit="kW"      amber />
                  <ReadoutCard label="Recommended battery"          value={result ? result.CbattRounded.toFixed(1) : '—'} unit="kWh"     accent />
                  <ReadoutCard label="Recommended PV array"         value={result ? result.PpvRounded.toFixed(2)   : '—'} unit="kWp" />
                </div>

                {result && (
                  <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl px-4 py-3 text-xs font-mono text-slate-400 leading-relaxed">
                    ≈ {result.panelCount} panels @ 550 Wp ·
                    Night energy {result.Enight_kWh.toFixed(2)} kWh ·
                    Day energy {result.Eday_kWh.toFixed(2)} kWh
                  </div>
                )}

                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4)' }}
                >
                  <Zap size={13} /> Request a detailed agricultural design
                </a>

                <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
                  Inverter sized at 1.3× peak running demand, rounded to the nearest standard
                  size. Final system design must be verified by a qualified engineer before
                  installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
