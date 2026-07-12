'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, Trash2, Zap, Clock, X } from 'lucide-react'
import {
  APPLIANCE_CATALOG, ApplianceRow, PSH_TABLE, findPSH,
  calculateResidentialSizing, SizingResult,
} from '@/lib/calculations'

const CAT_COLORS: Record<string, string> = {
  'Lighting':                   '#06b6d4',
  'Entertainment & Electronics': '#10b981',
  'Refrigeration':              '#3b82f6',
  'Water Systems':              '#6366f1',
  'Kitchen':                    '#f97316',
  'Climate Control':            '#a855f7',
  'Laundry':                    '#8fa6bc',
  'High Power Loads':           '#ef4444',
  'Miscellaneous':              '#94a3b8',
}

const CATS = [...new Set(APPLIANCE_CATALOG.map(a => a.cat))]

let rowSeq = 0

/* ── small shared components ── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 select-none">
      {children}
    </span>
  )
}

function ReadoutCard({
  label, value, unit, accent = false, amber = false,
}: {
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

/* ── histogram drawing (labelled axes) ── */
function drawHistogram(
  canvas: HTMLCanvasElement,
  profile: number[],        // 48 half-hour slots in Watts
  nightColor = '#f97316',
  dayColor   = '#06b6d4',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width, H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const maxW   = Math.max(1, ...profile)
  const padL   = 46, padB = 32, padT = 14, padR = 14
  const plotW  = W - padL - padR
  const plotH  = H - padT - padB
  const barW   = plotW / 24

  // ── grid lines + y-axis labels ──
  const ySteps = 5
  for (let i = 0; i <= ySteps; i++) {
    const val = (i / ySteps) * maxW          // watts
    const y   = padT + plotH - (i / ySteps) * plotH
    ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'
    ctx.lineWidth   = i === 0 ? 1.2 : 0.7
    ctx.setLineDash(i === 0 ? [] : [3, 4])
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke()
    ctx.setLineDash([])

    const label = val >= 1000 ? `${(val / 1000).toFixed(1)}` : `${Math.round(val)}`
    ctx.fillStyle   = '#6b7280'
    ctx.font        = '9px JetBrains Mono, monospace'
    ctx.textAlign   = 'right'
    ctx.fillText(label, padL - 5, y + 3.5)
  }

  // y-axis title (rotated)
  ctx.save()
  ctx.translate(10, padT + plotH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.font      = '9px JetBrains Mono, monospace'
  ctx.fillStyle = '#4b5563'
  ctx.textAlign = 'center'
  ctx.fillText('kW', 0, 0)
  ctx.restore()

  // ── hourly bars ──
  for (let h = 0; h < 24; h++) {
    const avg  = ((profile[h * 2] ?? 0) + (profile[h * 2 + 1] ?? 0)) / 2
    const barH = (avg / maxW) * plotH
    const x    = padL + h * barW
    const isNight = h < 6 || h >= 18
    const grad = ctx.createLinearGradient(0, padT + plotH - barH, 0, padT + plotH)
    grad.addColorStop(0, isNight ? `${nightColor}dd` : `${dayColor}dd`)
    grad.addColorStop(1, 'rgba(0,0,0,0.05)')
    ctx.fillStyle = grad
    ctx.fillRect(x + 1, padT + plotH - barH, Math.max(1, barW - 2), barH)
  }

  // ── x-axis labels (every 3 h) ──
  ctx.fillStyle = '#6b7280'
  ctx.font      = '9px JetBrains Mono, monospace'
  ctx.textAlign = 'center'
  for (let h = 0; h < 24; h += 3) {
    const x = padL + h * barW + barW / 2
    ctx.fillText(`${String(h).padStart(2, '0')}:00`, x, padT + plotH + 12)
  }

  // x-axis title
  ctx.font      = '9px JetBrains Mono, monospace'
  ctx.fillStyle = '#4b5563'
  ctx.textAlign = 'center'
  ctx.fillText('Hour of day', padL + plotW / 2, padT + plotH + 26)

  // axis lines
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth   = 1
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH + 1); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke()
}

/* ═══════════════════════════════════════════════════════════ */
export default function ResidentialTool() {
  const [rows,       setRows]       = useState<ApplianceRow[]>([])
  const [selectedCat,setSelectedCat]= useState('Lighting')
  const [selectedId, setSelectedId] = useState(APPLIANCE_CATALOG.find(a => a.cat === 'Lighting')?.id ?? '')
  const [pshId,      setPshId]      = useState('harare')
  const [mode,       setMode]       = useState<'standard' | 'advanced'>('standard')
  const [autonomy,   setAutonomy]   = useState(1)
  // misc load
  const [miscWatt,  setMiscWatt]  = useState(0)
  const [miscDesc,  setMiscDesc]  = useState('')
  const [miscFrom,  setMiscFrom]  = useState('06:00')
  const [miscTo,    setMiscTo]    = useState('22:00')

  const [result, setResult] = useState<SizingResult | null>(null)
  const histRef = useRef<HTMLCanvasElement>(null)

  /* recalculate */
  useEffect(() => {
    if (rows.length === 0) { setResult(null); return }
    const psh = findPSH(pshId).psh
    setResult(calculateResidentialSizing(rows, mode, psh, autonomy))
  }, [rows, pshId, mode, autonomy])

  /* draw histogram */
  useEffect(() => {
    if (!histRef.current) return
    if (!result) {
      const ctx = histRef.current.getContext('2d')
      ctx?.clearRect(0, 0, histRef.current.width, histRef.current.height)
      return
    }
    drawHistogram(histRef.current, result.profile)
  }, [result])

  /* ── row helpers ── */
  const addAppliance = useCallback(() => {
    const a = APPLIANCE_CATALOG.find(ap => ap.id === selectedId)
    if (!a) return
    if (mode === 'standard' && rows.length >= 15) {
      alert('Standard mode: max 15 appliances. Switch to Advanced for unlimited.')
      return
    }
    rowSeq++
    setRows(prev => [...prev, {
      rowId: rowSeq, applianceId: selectedId, qty: 1,
      periods: [{ from: '18:00', to: '22:00' }],
      customWatt: null,
    }])
  }, [selectedId, rows.length, mode])

  const addMisc = useCallback(() => {
    if (miscWatt <= 0) { alert('Enter a power rating above 0 W.'); return }
    rowSeq++
    setRows(prev => [...prev, {
      rowId: rowSeq, applianceId: '__misc__', qty: 1,
      periods: [{ from: miscFrom, to: miscTo }],
      miscName: miscDesc || 'Misc. load', miscWatt,
    }])
  }, [miscWatt, miscDesc, miscFrom, miscTo])

  const removeRow  = (id: number) => setRows(prev => prev.filter(r => r.rowId !== id))

  const updateRow = (id: number, patch: Partial<ApplianceRow>) =>
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

  const catAppliances = APPLIANCE_CATALOG.filter(a => a.cat === selectedCat)

  return (
    <section id="sizing" className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow">Free tool — Residential &amp; Small Commercial</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Solar Sizing Tool
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Add the appliances you want your solar system to power and the times they run.
            The tool builds a real 24-hour load profile and sizes your inverter, battery and
            PV array — the same methodology a qualified engineer uses for a first-pass design.
          </p>
        </div>

        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass">

            {/* ── top bar: mode + location ── */}
            <div className="flex flex-wrap gap-4 items-center justify-between px-6 py-4 border-b border-white/5">
              {/* Mode toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Mode</span>
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                  {(['standard', 'advanced'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                        mode === m
                          ? 'bg-brand-teal/15 text-brand-teal border-brand-teal/40'
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
                <select
                  value={pshId}
                  onChange={e => setPshId(e.target.value)}
                  className="tool-input text-xs"
                  style={{ minWidth: 210 }}
                >
                  {PSH_TABLE.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.options.map(o => (
                        <option key={o.id} value={o.id}>{o.label} — {o.psh} PSH</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* ── main body ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/5">

              {/* ──────────────── LEFT: inputs ──────────────── */}
              <div className="p-6 flex flex-col gap-5">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Appliance schedule
                </h3>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2">
                  {CATS.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCat(cat)
                        setSelectedId(APPLIANCE_CATALOG.find(a => a.cat === cat)?.id ?? '')
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        selectedCat === cat
                          ? 'border-brand-teal text-brand-teal bg-brand-teal/10'
                          : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                      }`}
                      style={{ borderLeftColor: CAT_COLORS[cat], borderLeftWidth: 3 }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Appliance selector + add */}
                <div className="flex gap-2">
                  <select
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                    className="tool-input flex-1 text-xs"
                  >
                    {catAppliances.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name}{' '}
                        {a.type === 'power' ? `(${a.watt} W)` : `(${a.kwh} kWh/day)`}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addAppliance}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold hover:scale-105 transition-transform flex-shrink-0"
                    style={{ background: 'linear-gradient(90deg,#06b6d4,#10b981)' }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* ── column header row ── */}
                {rows.length > 0 && (
                  <div className="grid gap-2 px-1"
                    style={{ gridTemplateColumns: mode === 'advanced' ? '1fr 52px 96px 96px 32px' : '1fr 52px 96px 96px 32px' }}>
                    <Label>Appliance</Label>
                    <Label>Qty</Label>
                    <Label>From</Label>
                    <Label>To</Label>
                    <span />
                  </div>
                )}

                {/* ── appliance rows ── */}
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                  {rows.length === 0 && (
                    <div className="text-center py-10 text-slate-600 font-mono text-xs uppercase tracking-wider">
                      Add appliances above to start sizing ↑
                    </div>
                  )}

                  {rows.map(r => {
                    const a = APPLIANCE_CATALOG.find(ap => ap.id === r.applianceId)
                    const name = r.miscName ?? a?.name ?? 'Unknown'
                    const isEnergy = a?.type === 'energy'
                    const defaultWatt = r.miscWatt ?? a?.watt ?? 0

                    return (
                      <div
                        key={r.rowId}
                        className="rounded-xl bg-white/3 border border-white/5 p-3 flex flex-col gap-2"
                      >
                        {/* Main row */}
                        <div className="grid gap-2 items-center"
                          style={{ gridTemplateColumns: '1fr 52px 96px 96px 32px' }}>

                          {/* Name */}
                          <div className="font-mono text-[11px] text-slate-200 truncate" title={name}>
                            {a?.warn  && <span className="text-red-400 mr-1">⚠</span>}
                            {a?.brief && <span className="text-amber-400 mr-1">⚡</span>}
                            {name}
                          </div>

                          {/* Qty */}
                          <input
                            type="number" min={1} value={r.qty}
                            onChange={e => updateRow(r.rowId, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="tool-input text-center text-xs text-white"
                          />

                          {/* From / To — or continuous badge */}
                          {isEnergy ? (
                            <div className="col-span-2 text-slate-600 font-mono text-[10px] pl-1 flex items-center">
                              continuous · 35% duty
                            </div>
                          ) : (
                            <>
                              <input
                                type="time" value={r.periods[0]?.from ?? '06:00'}
                                onChange={e => updatePeriod(r.rowId, 0, 'from', e.target.value)}
                                className="tool-input text-xs text-white"
                              />
                              <input
                                type="time" value={r.periods[0]?.to ?? '22:00'}
                                onChange={e => updatePeriod(r.rowId, 0, 'to', e.target.value)}
                                className="tool-input text-xs text-white"
                              />
                            </>
                          )}

                          {/* Remove */}
                          <button
                            onClick={() => removeRow(r.rowId)}
                            className="text-slate-600 hover:text-red-400 transition-colors flex items-center justify-center"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* ── Advanced extras ── */}
                        {mode === 'advanced' && !isEnergy && (
                          <div className="flex flex-col gap-2 pl-2 border-l-2 border-brand-teal/20">

                            {/* Custom power rating */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <Label>Custom power rating (W)</Label>
                              <input
                                type="number"
                                min={1}
                                placeholder={String(defaultWatt)}
                                value={r.customWatt ?? ''}
                                onChange={e => {
                                  const v = e.target.value === '' ? null : parseFloat(e.target.value)
                                  updateRow(r.rowId, { customWatt: v })
                                }}
                                className="tool-input text-xs w-24"
                              />
                              {r.customWatt && (
                                <span className="text-[10px] font-mono text-brand-amber">
                                  override: {r.customWatt} W (default {defaultWatt} W)
                                </span>
                              )}
                            </div>

                            {/* Additional periods */}
                            {r.periods.slice(1).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-2 flex-wrap">
                                <Label>Period {idx + 2}</Label>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono text-slate-500">From</span>
                                  <input
                                    type="time" value={p.from}
                                    onChange={e => updatePeriod(r.rowId, idx + 1, 'from', e.target.value)}
                                    className="tool-input text-xs w-24"
                                  />
                                  <span className="text-[10px] font-mono text-slate-500">To</span>
                                  <input
                                    type="time" value={p.to}
                                    onChange={e => updatePeriod(r.rowId, idx + 1, 'to', e.target.value)}
                                    className="tool-input text-xs w-24"
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
                              className="self-start flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10 transition-all"
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
                  {rows.length} / {mode === 'standard' ? '15 (standard)' : '∞ (advanced)'} appliances
                </div>

                {/* ── Miscellaneous load ── */}
                <details className="rounded-xl border border-white/8 overflow-hidden">
                  <summary className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-teal cursor-pointer bg-brand-teal/5 list-none flex items-center gap-2">
                    <Plus size={12} /> Add miscellaneous load
                  </summary>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Description</Label>
                      <input
                        value={miscDesc}
                        onChange={e => setMiscDesc(e.target.value)}
                        placeholder="e.g. Gate motor"
                        className="tool-input text-xs"
                      />
                    </div>
                    <div>
                      <Label>Power (W)</Label>
                      <input
                        type="number" min={0} value={miscWatt}
                        onChange={e => setMiscWatt(parseFloat(e.target.value) || 0)}
                        className="tool-input text-xs text-white"
                      />
                    </div>
                    <div>
                      <Label>Time of use</Label>
                      <div className="flex gap-1">
                        <div className="flex-1">
                          <Label>From</Label>
                          <input type="time" value={miscFrom} onChange={e => setMiscFrom(e.target.value)} className="tool-input text-xs text-white" />
                        </div>
                        <div className="flex-1">
                          <Label>To</Label>
                          <input type="time" value={miscTo}   onChange={e => setMiscTo(e.target.value)}   className="tool-input text-xs text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <button
                        onClick={addMisc}
                        className="w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-dark font-bold"
                        style={{ background: 'linear-gradient(90deg,#f97316,#eab308)' }}
                      >
                        Add miscellaneous load
                      </button>
                    </div>
                  </div>
                </details>

              </div>

              {/* ──────────────── RIGHT: outputs ──────────────── */}
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
                        Night (18:00–06:00)
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle" style={{ background: '#06b6d4' }} />
                        Day (06:00–18:00)
                      </span>
                    </div>
                  </div>
                  <canvas
                    ref={histRef}
                    width={560} height={160}
                    className="w-full rounded-lg"
                    style={{ height: 120 }}
                  />
                  {!result && (
                    <div className="text-center text-slate-600 font-mono text-xs py-2">
                      Add appliances to see your load profile →
                    </div>
                  )}
                </div>

                {/* Readout grid */}
                <div className="grid grid-cols-2 gap-3">
                  <ReadoutCard label="Daily energy"                    value={result ? result.Ed_kWh.toFixed(2)       : '—'} unit="kWh/day" accent />
                  <ReadoutCard label="Peak demand"                     value={result ? result.Peak_kW.toFixed(2)      : '—'} unit="kW"      amber />
                  <ReadoutCard label="Recommended inverter size"       value={result ? String(result.invSize)         : '—'} unit="kW" />
                  <ReadoutCard label="Recommended surge withstand"     value={result ? result.Surge_kW.toFixed(2)     : '—'} unit="kW"      amber />
                  <ReadoutCard label="Recommended battery"             value={result ? result.CbattRounded.toFixed(1) : '—'} unit="kWh"     accent />
                  <ReadoutCard label="Recommended PV array"            value={result ? result.PpvRounded.toFixed(2)   : '—'} unit="kWp" />
                </div>

                {/* Summary strip */}
                {result && (
                  <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-xl px-4 py-3 text-xs font-mono text-slate-400 leading-relaxed">
                    ≈ {result.panelCount} panels @ 550 Wp ·
                    Night energy {result.Enight_kWh.toFixed(2)} kWh ·
                    Day energy {result.Eday_kWh.toFixed(2)} kWh
                  </div>
                )}

                {/* Energy breakdown bar */}
                {result && (() => {
                  const total   = result.Ed_kWh
                  const entries = Object.entries(result.catTotalsWh)
                  if (total === 0 || entries.length === 0) return null
                  return (
                    <div>
                      <Label>Energy breakdown by category</Label>
                      <div className="h-3 rounded-full overflow-hidden flex bg-white/5">
                        {entries.map(([cat, wh]) => (
                          <div
                            key={cat}
                            style={{ width: `${(wh / 1000 / total) * 100}%`, background: CAT_COLORS[cat] ?? '#6b7280' }}
                            title={`${cat}: ${(wh / 1000).toFixed(2)} kWh`}
                            className="h-full transition-all duration-500"
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        {entries.map(([cat, wh]) => (
                          <span key={cat} className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: CAT_COLORS[cat] }} />
                            {cat} {(wh / 1000).toFixed(1)} kWh
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* CTA */}
                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-dark hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(90deg,#f97316,#eab308)' }}
                >
                  <Zap size={13} /> Request a detailed design
                </a>

                <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
                  Final system sizing and equipment selection should be reviewed and verified
                  by a qualified Engineer or Solar Design Professional before installation.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
