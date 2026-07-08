// ============================================================
// VoltSage Solutions — Calculation Engine (TypeScript)
// Based on Solar Design Calculation Methodology, Revision 1
// ============================================================

export const STANDARD_INVERTER_SIZES = [1,1.5,2,2.5,3,3.5,4,5,6,8,10,12,15,20,25,30,40,50]

export function roundUpToStandardInverter(rawKW: number): number {
  return STANDARD_INVERTER_SIZES.find(s => s >= rawKW) ?? (rawKW > 0 ? Math.ceil(rawKW) : 0)
}

// ----- PSH Table -----
export interface PSHOption { id: string; label: string; psh: number }
export interface PSHGroup  { group: string; options: PSHOption[] }

export const PSH_TABLE: PSHGroup[] = [
  { group: 'Zimbabwe — by province', options: [
    { id: 'bulawayo',    label: 'Bulawayo',              psh: 5.8 },
    { id: 'harare',     label: 'Harare',                 psh: 5.6 },
    { id: 'manicaland', label: 'Manicaland',             psh: 5.5 },
    { id: 'mashcentral',label: 'Mashonaland Central',    psh: 5.7 },
    { id: 'masheast',   label: 'Mashonaland East',       psh: 5.7 },
    { id: 'mashwest',   label: 'Mashonaland West',       psh: 5.8 },
    { id: 'masvingo',   label: 'Masvingo',               psh: 5.9 },
    { id: 'matnorth',   label: 'Matabeleland North',     psh: 6.0 },
    { id: 'matsouth',   label: 'Matabeleland South',     psh: 6.1 },
    { id: 'midlands',   label: 'Midlands',               psh: 5.8 },
  ]},
  { group: 'Africa — Category A (6.5 h/day)', options: [
    { id: 'algeria',    label: 'Algeria',      psh: 6.5 },
    { id: 'chad',       label: 'Chad',         psh: 6.5 },
    { id: 'egypt',      label: 'Egypt',        psh: 6.5 },
    { id: 'libya',      label: 'Libya',        psh: 6.5 },
    { id: 'mauritania', label: 'Mauritania',   psh: 6.5 },
    { id: 'niger',      label: 'Niger',        psh: 6.5 },
    { id: 'sudan',      label: 'Sudan',        psh: 6.5 },
  ]},
  { group: 'Africa — Category B (6.0 h/day)', options: [
    { id: 'botswana',   label: 'Botswana',     psh: 6.0 },
    { id: 'namibia',    label: 'Namibia',      psh: 6.0 },
    { id: 'zambia',     label: 'Zambia',       psh: 6.0 },
  ]},
  { group: 'Africa — Category C (5.8 h/day)', options: [
    { id: 'angola',      label: 'Angola',       psh: 5.8 },
    { id: 'eswatini',    label: 'Eswatini',     psh: 5.8 },
    { id: 'malawi',      label: 'Malawi',       psh: 5.8 },
    { id: 'mozambique',  label: 'Mozambique',   psh: 5.8 },
    { id: 'southafrica', label: 'South Africa', psh: 5.8 },
    { id: 'tanzania',    label: 'Tanzania',     psh: 5.8 },
  ]},
  { group: 'Africa — Category D (5.5 h/day)', options: [
    { id: 'cameroon',    label: 'Cameroon',        psh: 5.5 },
    { id: 'cotedivoire', label: "Côte d'Ivoire",   psh: 5.5 },
    { id: 'ghana',       label: 'Ghana',           psh: 5.5 },
    { id: 'kenya',       label: 'Kenya',           psh: 5.5 },
    { id: 'nigeria',     label: 'Nigeria',         psh: 5.5 },
    { id: 'rwanda',      label: 'Rwanda',          psh: 5.5 },
    { id: 'senegal',     label: 'Senegal',         psh: 5.5 },
    { id: 'uganda',      label: 'Uganda',          psh: 5.5 },
  ]},
  { group: 'Africa — Category E (5.0 h/day)', options: [
    { id: 'burundi',    label: 'Burundi',           psh: 5.0 },
    { id: 'drc',        label: 'DR Congo',          psh: 5.0 },
    { id: 'eqguinea',   label: 'Equatorial Guinea', psh: 5.0 },
    { id: 'gabon',      label: 'Gabon',             psh: 5.0 },
    { id: 'liberia',    label: 'Liberia',           psh: 5.0 },
    { id: 'sierraleone',label: 'Sierra Leone',      psh: 5.0 },
  ]},
]

export function findPSH(id: string): PSHOption {
  for (const g of PSH_TABLE) {
    const f = g.options.find(o => o.id === id)
    if (f) return f
  }
  return PSH_TABLE[0].options[1] // Harare default
}

// ----- Appliance Catalog -----
export type ApplianceType = 'power' | 'energy'
export interface Appliance {
  id: string; name: string; cat: string; type: ApplianceType
  watt?: number; kwh?: number; surge?: number; runningWatt?: number
  dutyCycle?: number; brief?: boolean; warn?: boolean
}

export const APPLIANCE_CATALOG: Appliance[] = [
  // Lighting
  { id:'ledbulb',       name:'LED Bulb',                 cat:'Lighting',                  type:'power', watt:10 },
  { id:'leddownlight',  name:'LED Downlight',            cat:'Lighting',                  type:'power', watt:12 },
  { id:'seclight',      name:'Security Light (LED)',     cat:'Lighting',                  type:'power', watt:30 },
  { id:'flood',         name:'Floodlight (LED)',         cat:'Lighting',                  type:'power', watt:50 },
  // Entertainment
  { id:'tv1',    name:'LED TV (32–43")',        cat:'Entertainment & Electronics', type:'power', watt:80 },
  { id:'tv2',    name:'LED TV (50–65")',        cat:'Entertainment & Electronics', type:'power', watt:120 },
  { id:'decoder',name:'Decoder',               cat:'Entertainment & Electronics', type:'power', watt:20 },
  { id:'router', name:'WiFi Router',           cat:'Entertainment & Electronics', type:'power', watt:15 },
  { id:'laptop', name:'Laptop',                cat:'Entertainment & Electronics', type:'power', watt:65 },
  { id:'desktop',name:'Desktop Computer',      cat:'Entertainment & Electronics', type:'power', watt:250 },
  { id:'printer',name:'Printer',               cat:'Entertainment & Electronics', type:'power', watt:100 },
  // Refrigeration (duty-cycle — surge 6)
  { id:'fridge_bar',     name:'Bar Fridge (150 L)',             cat:'Refrigeration', type:'energy', runningWatt:100, surge:6, dutyCycle:0.35, kwh:1.0 },
  { id:'fridge_single',  name:'Single Door Fridge (250 L)',     cat:'Refrigeration', type:'energy', runningWatt:150, surge:6, dutyCycle:0.35, kwh:1.5 },
  { id:'fridge_double',  name:'Double Door Fridge (250–400 L)', cat:'Refrigeration', type:'energy', runningWatt:250, surge:6, dutyCycle:0.35, kwh:1.6 },
  { id:'fridge_sxs',     name:'Side-by-Side Refrigerator',      cat:'Refrigeration', type:'energy', runningWatt:400, surge:6, dutyCycle:0.35, kwh:3.0 },
  { id:'fridge_commercial',name:'Commercial Display Fridge',    cat:'Refrigeration', type:'energy', runningWatt:800, surge:5, dutyCycle:0.35, kwh:10.0 },
  { id:'chestfreezer',   name:'Chest Freezer',                  cat:'Refrigeration', type:'energy', runningWatt:200, surge:6, dutyCycle:0.35, kwh:1.7 },
  { id:'uprightfreezer', name:'Upright Freezer',                cat:'Refrigeration', type:'energy', runningWatt:260, surge:6, dutyCycle:0.35, kwh:2.2 },
  // Water Systems (surge 3)
  { id:'boreholesmall', name:'Borehole Pump — Small (0.75 kW)', cat:'Water Systems', type:'power', watt:750,  surge:3 },
  { id:'boreholemed',   name:'Borehole Pump — Medium (1.1 kW)', cat:'Water Systems', type:'power', watt:1100, surge:3 },
  { id:'boreholelarge', name:'Borehole Pump — Large (1.5 kW)',  cat:'Water Systems', type:'power', watt:1500, surge:3 },
  { id:'booster',       name:'Booster Pump',                    cat:'Water Systems', type:'power', watt:370,  surge:3 },
  // Kitchen (brief)
  { id:'microwave', name:'Microwave',      cat:'Kitchen', type:'power', watt:1200, brief:true },
  { id:'kettle',    name:'Electric Kettle',cat:'Kitchen', type:'power', watt:2000, brief:true },
  { id:'airfryer',  name:'Air Fryer',      cat:'Kitchen', type:'power', watt:1500, brief:true },
  { id:'blender',   name:'Blender',        cat:'Kitchen', type:'power', watt:500,  brief:true },
  { id:'toaster',   name:'Toaster',        cat:'Kitchen', type:'power', watt:1000, brief:true },
  // Climate Control
  { id:'ceilingfan',  name:'Ceiling Fan',                        cat:'Climate Control', type:'power', watt:60 },
  { id:'pedestalfan', name:'Pedestal Fan',                       cat:'Climate Control', type:'power', watt:80 },
  { id:'acsmall',     name:'Small Air Conditioner (9000 BTU)',   cat:'Climate Control', type:'power', watt:900,  surge:3 },
  { id:'acmed',       name:'Medium Air Conditioner (12000 BTU)', cat:'Climate Control', type:'power', watt:1200, surge:3 },
  { id:'aclarge',     name:'Large Air Conditioner (18000 BTU)',  cat:'Climate Control', type:'power', watt:1800, surge:3 },
  // Laundry
  { id:'washer', name:'Washing Machine', cat:'Laundry', type:'power', watt:500 },
  { id:'dryer',  name:'Tumble Dryer',    cat:'Laundry', type:'power', watt:3000 },
  { id:'iron',   name:'Iron',            cat:'Laundry', type:'power', watt:1200 },
  // High Power (warn)
  { id:'stove',        name:'Electric Stove Plate',  cat:'High Power Loads', type:'power', watt:2000, warn:true },
  { id:'oven',         name:'Oven',                  cat:'High Power Loads', type:'power', watt:4000, warn:true },
  { id:'instantheater',name:'Instant Water Heater',  cat:'High Power Loads', type:'power', watt:6500, warn:true },
  { id:'poolheat',     name:'Pool Heat Pump',         cat:'High Power Loads', type:'power', watt:3500, warn:true, surge:3 },
]

export function findAppliance(id: string): Appliance | undefined {
  return APPLIANCE_CATALOG.find(a => a.id === id)
}

// ----- Time helpers -----
export function timeToHours(from: string, to: string): number {
  if (!from || !to) return 0
  const [fh, fm] = from.split(':').map(Number)
  const [th, tm] = to.split(':').map(Number)
  const start = fh + fm / 60, end = th + tm / 60
  let diff = end - start
  if (diff <= 0) diff += 24
  return diff
}

export function periodRange(from: string, to: string) {
  const [fh, fm] = from.split(':').map(Number)
  const start = fh + fm / 60
  return { start, end: start + timeToHours(from, to) }
}

export function nightHoursForPeriod(from: string, to: string): number {
  const { start, end } = periodRange(from, to)
  const NIGHT = [[18, 30], [-6, 6]] as const
  let n = 0
  NIGHT.forEach(([s, e]) => { n += Math.max(0, Math.min(end, e) - Math.max(start, s)) })
  return Math.min(n, end - start)
}

export function isActiveAtSlot(t: number, start: number, end: number): boolean {
  return (t >= start && t < end) || (t + 24 >= start && t + 24 < end)
}

// ----- Row types -----
export interface ApplianceRow {
  rowId:      number
  applianceId:string
  qty:        number
  periods:    { from: string; to: string }[]
  customWatt?: number | null   // Advanced: override default watt
  miscName?:  string
  miscWatt?:  number
}

export interface AgEquipmentRow {
  rowId:    number
  eqId:     string
  name:     string
  kw:       number             // Default rated power
  customKW?: number | null     // Advanced: override default kW
  surge:    number
  qty:      number
  periods:  { from: string; to: string }[]
}

// ----- Main Sizing Calculation -----
export interface SizingResult {
  Ed_kWh:       number
  Enight_kWh:   number
  Eday_kWh:     number
  Peak_kW:      number
  Surge_kW:     number
  invSize:      number
  CbattRounded: number
  PpvRounded:   number
  panelCount:   number
  autonomyHours:number
  profile:      number[]
  catTotalsWh:  Record<string, number>
}

export function calculateResidentialSizing(
  rows:     ApplianceRow[],
  mode:     'standard' | 'advanced',
  psh:      number,
  autonomy: number,
  dod = 0.8, battEff = 0.95, chargeEff = 0.85,
  mu = 0.75, panelWp = 550
): SizingResult {
  const SLOTS = 48, SLOT_H = 0.5
  const profile = new Array<number>(SLOTS).fill(0)
  let Ed_Wh = 0, Enight_Wh = 0, Eday_Wh = 0
  const catTotalsWh: Record<string, number> = {}

  rows.forEach(r => {
    const a = findAppliance(r.applianceId)
    if (!a) return
    if (a.type === 'energy') {
      const kwhPerDay = a.kwh ?? 0
      const totalWh = r.qty * kwhPerDay * 1000
      Ed_Wh += totalWh
      catTotalsWh[a.cat] = (catTotalsWh[a.cat] ?? 0) + totalWh
      Enight_Wh += totalWh / 2; Eday_Wh += totalWh / 2
      const avgKW = (r.qty * kwhPerDay) / 24
      for (let s = 0; s < SLOTS; s++) profile[s] += avgKW * 1000
    } else {
      // In Advanced mode use customWatt if set, else default
      const watt = r.miscWatt ?? (mode === 'advanced' && r.customWatt ? r.customWatt : (a.watt ?? 0))
      r.periods.forEach(p => {
        const hrs    = timeToHours(p.from, p.to)
        const nightH = nightHoursForPeriod(p.from, p.to)
        Ed_Wh     += r.qty * watt * hrs
        Enight_Wh += r.qty * watt * nightH
        Eday_Wh   += r.qty * watt * (hrs - nightH)
        catTotalsWh[a.cat] = (catTotalsWh[a.cat] ?? 0) + r.qty * watt * hrs
        const { start, end } = periodRange(p.from, p.to)
        for (let s = 0; s < SLOTS; s++) {
          if (isActiveAtSlot(s * SLOT_H, start, end)) profile[s] += r.qty * watt
        }
      })
    }
  })

  let Pmax_W = 0, tMaxSlot = 0
  profile.forEach((w, s) => { if (w > Pmax_W) { Pmax_W = w; tMaxSlot = s } })

  const tMax = tMaxSlot * SLOT_H
  let surgeExtra = 0
  rows.forEach(r => {
    const a = findAppliance(r.applianceId)
    if (!a || (a.surge ?? 1) <= 1) return
    if (a.type === 'energy') {
      surgeExtra += r.qty * (a.runningWatt ?? 0) * ((a.surge ?? 1) - 1)
    } else {
      const watt = r.miscWatt ?? (mode === 'advanced' && r.customWatt ? r.customWatt : (a.watt ?? 0))
      const active = r.periods.some(p => {
        const { start, end } = periodRange(p.from, p.to)
        return isActiveAtSlot(tMax, start, end)
      })
      if (active) surgeExtra += r.qty * watt * ((a.surge ?? 1) - 1)
    }
  })

  const Ed_kWh = Ed_Wh / 1000, Enight_kWh = Enight_Wh / 1000, Eday_kWh = Eday_Wh / 1000
  const Peak_kW = Pmax_W / 1000, Surge_kW = (Pmax_W + surgeExtra) / 1000

  const invRaw       = Peak_kW * 1.3
  const invSize      = roundUpToStandardInverter(invRaw)
  const CbattRaw     = Enight_kWh > 0 ? (Enight_kWh * autonomy) / (dod * battEff) : 0
  const CbattRounded = Math.ceil(CbattRaw * 2) / 2
  const usable       = CbattRounded * dod * battEff
  const avgNightLoad = Enight_kWh / 12
  const autonomyHours = avgNightLoad > 0 ? usable / avgNightLoad : 0
  const Epv          = Eday_kWh + (CbattRounded > 0 ? CbattRounded / chargeEff : 0)
  const pvRaw        = Epv > 0 ? Epv / (psh * mu) : 0
  const PpvRounded   = Math.ceil(pvRaw * 2) / 2
  const panelCount   = Math.ceil((PpvRounded * 1000) / panelWp)

  return { Ed_kWh, Enight_kWh, Eday_kWh, Peak_kW, Surge_kW, invSize, CbattRounded, PpvRounded, panelCount, autonomyHours, profile, catTotalsWh }
}

// ----- Battery Runtime -----
export interface BatteryRuntimeResult {
  usableKWh:          number
  runtimeHours:       number
  runtimeAtPeakHours: number | null
  runtimeAtAvgHours:  number | null
}

export function calculateBatteryRuntime(
  capacityKWh: number, dodPct: number, effPct: number, loadKW: number,
  sizingResult?: SizingResult
): BatteryRuntimeResult {
  const dod = dodPct / 100, eff = effPct / 100
  const usableKWh    = capacityKWh * dod * eff
  const runtimeHours = loadKW > 0 ? usableKWh / loadKW : 0
  const runtimeAtPeakHours = sizingResult && sizingResult.Peak_kW > 0 ? usableKWh / sizingResult.Peak_kW : null
  const avgLoad = sizingResult ? sizingResult.Ed_kWh / 24 : null
  const runtimeAtAvgHours  = avgLoad && avgLoad > 0 ? usableKWh / avgLoad : null
  return { usableKWh, runtimeHours, runtimeAtPeakHours, runtimeAtAvgHours }
}

// ----- Agricultural Equipment -----
export interface AgEquipment { id: string; name: string; kw: number; surge: number }
export type AgActivity = 'Irrigation' | 'Dairy Farming' | 'Poultry Farming' | 'Piggery' | 'Greenhouse Farming' | 'Crop Processing' | 'Mixed Farming'

export const AG_ACTIVITIES: Record<AgActivity, AgEquipment[]> = {
  'Irrigation': [
    { id:'borehole',    name:'Borehole Pump',         kw:7.5, surge:3.0 },
    { id:'river_pump',  name:'River / Surface Pump',  kw:5.5, surge:3.0 },
    { id:'booster',     name:'Booster Pump',          kw:2.2, surge:3.0 },
    { id:'fertigation', name:'Fertigation Pump',      kw:1.5, surge:3.0 },
    { id:'centrepivot', name:'Centre Pivot Motor',    kw:3.0, surge:2.5 },
  ],
  'Dairy Farming': [
    { id:'milking',      name:'Milking Machine',        kw:3.0, surge:3.0 },
    { id:'milk_cooling', name:'Milk Cooling Compressor',kw:5.5, surge:3.5 },
    { id:'water_pump',   name:'Water Pump',             kw:1.5, surge:3.0 },
    { id:'vent_fan',     name:'Ventilation Fan',        kw:1.1, surge:2.5 },
  ],
  'Poultry Farming': [
    { id:'vent_fan',   name:'Ventilation Fan',  kw:0.75, surge:2.5 },
    { id:'lighting',   name:'Poultry Lighting', kw:0.5,  surge:1.0 },
    { id:'feeder',     name:'Automatic Feeder', kw:0.37, surge:2.5 },
    { id:'water_pump', name:'Water Pump',       kw:0.75, surge:3.0 },
  ],
  'Piggery': [
    { id:'vent_fan',   name:'Ventilation Fan', kw:0.75, surge:2.5 },
    { id:'feed_mixer', name:'Feed Mixer',      kw:2.2,  surge:2.5 },
    { id:'water_pump', name:'Water Pump',      kw:0.75, surge:3.0 },
  ],
  'Greenhouse Farming': [
    { id:'irrig_pump', name:'Irrigation Pump',    kw:2.2, surge:3.0 },
    { id:'circ_pump',  name:'Circulation Pump',   kw:1.1, surge:3.0 },
    { id:'ext_fan',    name:'Extraction Fan',     kw:1.5, surge:2.5 },
    { id:'gh_light',   name:'Greenhouse Lighting',kw:1.0, surge:1.0 },
  ],
  'Crop Processing': [
    { id:'hammer_mill', name:'Hammer Mill',   kw:7.5, surge:2.5 },
    { id:'maize_mill',  name:'Maize Mill',    kw:5.5, surge:2.5 },
    { id:'oil_press',   name:'Oil Press',     kw:4.0, surge:2.5 },
    { id:'grain_clean', name:'Grain Cleaner', kw:2.2, surge:2.5 },
    { id:'conveyor',    name:'Conveyor',      kw:1.5, surge:2.5 },
  ],
  'Mixed Farming': [
    { id:'borehole',    name:'Borehole Pump',        kw:7.5, surge:3.0 },
    { id:'milking',     name:'Milking Machine',       kw:3.0, surge:3.0 },
    { id:'vent_fan',    name:'Ventilation Fan',       kw:0.75,surge:2.5 },
    { id:'hammer_mill', name:'Hammer Mill',           kw:7.5, surge:2.5 },
    { id:'irrig_pump',  name:'Irrigation / Booster',  kw:2.2, surge:3.0 },
    { id:'feed_mixer',  name:'Feed Mixer',            kw:2.2, surge:2.5 },
  ],
}

export function calculateAgriculturalSizing(
  equipRows: AgEquipmentRow[],
  mode:      'standard' | 'advanced',
  psh:       number,
  autonomy:  number,
  dod = 0.8, battEff = 0.95, chargeEff = 0.85, mu = 0.75, panelWp = 550
): SizingResult {
  const SLOTS = 48, SLOT_H = 0.5
  const profile = new Array<number>(SLOTS).fill(0)
  let Ed = 0, Enight = 0, Eday = 0

  equipRows.forEach(r => {
    // In Advanced mode use customKW override if set
    const kw = mode === 'advanced' && r.customKW ? r.customKW : r.kw
    r.periods.forEach(p => {
      const hrs    = timeToHours(p.from, p.to)
      const nightH = nightHoursForPeriod(p.from, p.to)
      Ed     += r.qty * kw * hrs
      Enight += r.qty * kw * nightH
      Eday   += r.qty * kw * (hrs - nightH)
      const { start, end } = periodRange(p.from, p.to)
      for (let s = 0; s < SLOTS; s++) {
        if (isActiveAtSlot(s * SLOT_H, start, end)) profile[s] += r.qty * kw * 1000
      }
    })
  })

  let Pmax = 0, tMaxSlot = 0
  profile.forEach((w, s) => { if (w > Pmax) { Pmax = w; tMaxSlot = s } })

  const tMax = tMaxSlot * SLOT_H
  let surgeExtra = 0
  equipRows.forEach(r => {
    if (r.surge <= 1) return
    const kw     = mode === 'advanced' && r.customKW ? r.customKW : r.kw
    const active = r.periods.some(p => {
      const { start, end } = periodRange(p.from, p.to)
      return isActiveAtSlot(tMax, start, end)
    })
    if (active) surgeExtra += r.qty * kw * 1000 * (r.surge - 1)
  })

  const Peak_kW    = Pmax / 1000
  const Surge_kW   = (Pmax + surgeExtra) / 1000
  const invRaw     = Peak_kW * 1.3
  const invSize    = roundUpToStandardInverter(invRaw)
  const CbattRaw   = Enight > 0 ? (Enight * autonomy) / (dod * battEff) : 0
  const CbattRounded = Math.ceil(CbattRaw * 2) / 2
  const usable       = CbattRounded * dod * battEff
  const avgNight     = Enight / 12
  const autonomyHours = avgNight > 0 ? usable / avgNight : 0
  const Epv        = Eday + (CbattRounded > 0 ? CbattRounded / chargeEff : 0)
  const pvRaw      = Epv > 0 ? Epv / (psh * mu) : 0
  const PpvRounded = Math.ceil(pvRaw * 2) / 2
  const panelCount = Math.ceil((PpvRounded * 1000) / panelWp)

  return {
    Ed_kWh: Ed, Enight_kWh: Enight, Eday_kWh: Eday,
    Peak_kW, Surge_kW, invSize, CbattRounded, PpvRounded, panelCount, autonomyHours,
    profile, catTotalsWh: {}
  }
}
