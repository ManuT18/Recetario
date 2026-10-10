'use client'

import { useState } from 'react'
import { Droplet, TestTube, Scale } from 'lucide-react'

export default function HerramientasPage() {
  // --- Calculadora 1: Preparación (La que ya teníamos) ---
  const [alcVolume, setAlcVolume] = useState<string>('')
  const [initialAbv, setInitialAbv] = useState<string>('96')
  const [targetAbv, setTargetAbv] = useState<string>('30')
  const [sugarGrams, setSugarGrams] = useState<string>('')

  let prepWaterNeeded = 0
  let prepTotalVolume = 0
  if (alcVolume && initialAbv && targetAbv && sugarGrams) {
    const vAlc = parseFloat(alcVolume)
    const abvI = parseFloat(initialAbv) / 100
    const abvF = parseFloat(targetAbv) / 100
    const sug = parseFloat(sugarGrams)
    
    if (vAlc > 0 && abvI > 0 && abvF > 0 && sug >= 0) {
      const pureAlc = vAlc * abvI
      prepTotalVolume = pureAlc / abvF
      const sugVol = sug * 0.63
      prepWaterNeeded = prepTotalVolume - vAlc - sugVol
    }
  }

  // --- Calculadora 2: Rebaje de Licor Terminado ---
  const [liqVolume, setLiqVolume] = useState<string>('')
  const [liqInitialAbv, setLiqInitialAbv] = useState<string>('')
  const [liqTargetAbv, setLiqTargetAbv] = useState<string>('')
  const [syrupRatio, setSyrupRatio] = useState<string>('1') // 1g azucar por 1ml agua

  let syrupVolToAdd = 0
  let rebWaterNeeded = 0
  let rebSugarNeeded = 0
  if (liqVolume && liqInitialAbv && liqTargetAbv && syrupRatio) {
    const vLiq = parseFloat(liqVolume)
    const abvI = parseFloat(liqInitialAbv) / 100
    const abvF = parseFloat(liqTargetAbv) / 100
    const ratio = parseFloat(syrupRatio)

    if (vLiq > 0 && abvI > 0 && abvF > 0 && abvF < abvI && ratio > 0) {
      const pureAlc = vLiq * abvI
      const finalVol = pureAlc / abvF
      syrupVolToAdd = finalVol - vLiq
      
      // Volumen de almibar = agua + (agua * ratio * 0.63)
      // syrupVol = agua * (1 + ratio * 0.63)
      rebWaterNeeded = syrupVolToAdd / (1 + (ratio * 0.63))
      rebSugarNeeded = rebWaterNeeded * ratio
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8 space-y-10">
      <div>
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">Herramientas</h1>
        <p className="text-stone-500">Calculadoras especializadas para tus preparaciones de licores.</p>
      </div>

      {/* Herramienta 1: Preparación (Desde Alcohol 96%) */}
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <TestTube className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800">1. Preparación de Licores</h2>
            <p className="text-sm text-stone-500">Para calcular el agua de un licor nuevo a partir de alcohol puro filtrado.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">Alcohol Filtrado (ml)</label>
            <input type="number" value={alcVolume} onChange={e => setAlcVolume(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ej: 500" />
          </div>
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">Azúcar a usar (grs)</label>
            <input type="number" value={sugarGrams} onChange={e => setSugarGrams(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ej: 350" />
          </div>
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">% Alc. Inicial</label>
            <input type="number" value={initialAbv} onChange={e => setInitialAbv(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">% Final Deseado</label>
            <input type="number" value={targetAbv} onChange={e => setTargetAbv(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        {prepWaterNeeded > 0 && (
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-inner flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium mb-1">Debes agregar exactamente:</p>
              <p className="text-4xl font-serif font-bold">{Math.round(prepWaterNeeded)} ml de Agua pura</p>
            </div>
            <div className="text-right border-l border-blue-500 pl-6">
              <p className="text-blue-200 text-sm">Volumen final aprox.</p>
              <p className="font-bold text-xl">{Math.round(prepTotalVolume)} ml</p>
            </div>
          </div>
        )}
      </div>

      {/* Herramienta 2: Rebaje de Licor Terminado */}
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800">2. Rebajar Licor Fuerte</h2>
            <p className="text-sm text-stone-500">Si un licor ya hecho quedó muy fuerte y quieres bajarle los grados agregando almíbar.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">Licor Actual (ml)</label>
            <input type="number" value={liqVolume} onChange={e => setLiqVolume(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Ej: 1000" />
          </div>
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">% Alc. Actual</label>
            <input type="number" value={liqInitialAbv} onChange={e => setLiqInitialAbv(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Ej: 35" />
          </div>
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">% Alc. Deseado</label>
            <input type="number" value={liqTargetAbv} onChange={e => setLiqTargetAbv(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Ej: 25" />
          </div>
          <div>
            <label className="text-stone-700 text-xs font-bold uppercase tracking-wider block mb-2">Proporción Almíbar</label>
            <select value={syrupRatio} onChange={e => setSyrupRatio(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="1">1:1 (Igual azúcar y agua)</option>
              <option value="0.5">Medio (Mitad azúcar que agua)</option>
              <option value="0">Solo Agua (Sin azúcar)</option>
            </select>
          </div>
        </div>

        {syrupVolToAdd > 0 && (
          <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-inner">
            <p className="text-emerald-100 font-medium mb-4">Debes agregar {Math.round(syrupVolToAdd)} ml de almíbar. Prepáralo con:</p>
            <div className="flex items-center gap-10">
              <div>
                <p className="text-xs text-emerald-200 uppercase tracking-widest mb-1">Agua</p>
                <p className="text-3xl font-serif font-bold">{Math.round(rebWaterNeeded)} ml</p>
              </div>
              <div className="text-4xl font-light text-emerald-400">+</div>
              <div>
                <p className="text-xs text-emerald-200 uppercase tracking-widest mb-1">Azúcar</p>
                <p className="text-3xl font-serif font-bold">{Math.round(rebSugarNeeded)} grs</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
