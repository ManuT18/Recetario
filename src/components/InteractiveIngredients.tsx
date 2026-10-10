'use client'

import { useState } from 'react'
import type { Ingredient } from '@/types/database'
import { Droplet, Scale } from 'lucide-react'

export default function InteractiveIngredients({ 
  ingredients, 
  hasScale, 
  hasAbv 
}: { 
  ingredients: Ingredient[], 
  hasScale?: boolean, 
  hasAbv?: boolean 
}) {
  const [multiplier, setMultiplier] = useState<number>(1)
  
  // ABV Calc State
  const [alcVolume, setAlcVolume] = useState<string>('')
  const [initialAbv, setInitialAbv] = useState<string>('96')
  const [targetAbv, setTargetAbv] = useState<string>('30')
  const [sugarGrams, setSugarGrams] = useState<string>('')

  // Derived ABV Math
  let waterNeeded = 0
  let totalVolume = 0
  if (alcVolume && initialAbv && targetAbv && sugarGrams) {
    const vAlc = parseFloat(alcVolume)
    const abvI = parseFloat(initialAbv) / 100
    const abvF = parseFloat(targetAbv) / 100
    const sug = parseFloat(sugarGrams)
    
    if (vAlc > 0 && abvI > 0 && abvF > 0 && sug >= 0) {
      const pureAlc = vAlc * abvI
      totalVolume = pureAlc / abvF
      const sugVol = sug * 0.63
      waterNeeded = totalVolume - vAlc - sugVol
    }
  }

  // Parse original quantities
  const displayIngredients = ingredients.map(ing => {
    // try to parse number if it starts with a number
    const match = String(ing.quantity).trim().match(/^([0-9.,]+)(.*)$/)
    if (match && multiplier !== 1) {
      const numStr = match[1].replace(',', '.')
      const num = parseFloat(numStr)
      if (!isNaN(num)) {
        const scaled = num * multiplier
        // format to max 2 decimals
        const rounded = Math.round(scaled * 100) / 100
        return { ...ing, quantity: `${rounded}${match[2]}` }
      }
    }
    return ing
  })

  return (
    <div className="space-y-6">
      {/* Calculators */}
      {(hasScale || hasAbv) && (
        <div className="space-y-4">
          {hasScale && (
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-amber-900">
                <Scale className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Escalar Receta</h3>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-amber-800 font-medium">Multiplicador:</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMultiplier(m => Math.max(0.25, m - 0.25))} className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold hover:bg-amber-300 flex items-center justify-center">-</button>
                  <span className="font-mono font-bold text-lg w-12 text-center text-amber-950">x{multiplier}</span>
                  <button onClick={() => setMultiplier(m => m + 0.25)} className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold hover:bg-amber-300 flex items-center justify-center">+</button>
                </div>
              </div>
            </div>
          )}

          {hasAbv && (
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-900">
                <Droplet className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Dilución (ABV)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="text-blue-800 text-[11px] font-bold uppercase tracking-wider block mb-1">Alcohol (ml)</label>
                  <input type="number" value={alcVolume} onChange={e => setAlcVolume(e.target.value)} className="w-full bg-white border border-blue-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ej: 500" />
                </div>
                <div>
                  <label className="text-blue-800 text-[11px] font-bold uppercase tracking-wider block mb-1">Azúcar (grs)</label>
                  <input type="number" value={sugarGrams} onChange={e => setSugarGrams(e.target.value)} className="w-full bg-white border border-blue-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ej: 500" />
                </div>
                <div>
                  <label className="text-blue-800 text-[11px] font-bold uppercase tracking-wider block mb-1">% Inicial</label>
                  <input type="number" value={initialAbv} onChange={e => setInitialAbv(e.target.value)} className="w-full bg-white border border-blue-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="text-blue-800 text-[11px] font-bold uppercase tracking-wider block mb-1">% Deseado</label>
                  <input type="number" value={targetAbv} onChange={e => setTargetAbv(e.target.value)} className="w-full bg-white border border-blue-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              
              {waterNeeded > 0 ? (
                <div className="bg-blue-900 text-white p-4 rounded-lg shadow-inner">
                  <p className="text-sm text-blue-200 mb-1">Agregar Agua:</p>
                  <p className="text-3xl font-bold font-serif mb-2">{Math.round(waterNeeded)} ml</p>
                  <div className="h-px bg-blue-800/50 w-full mb-2"></div>
                  <p className="text-xs text-blue-300">Volumen final aprox: {Math.round(totalVolume)} ml</p>
                </div>
              ) : alcVolume ? (
                <div className="text-blue-600 text-sm italic">Completa los datos para ver el cálculo.</div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Ingredients List */}
      <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
        <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-5 border-b border-stone-100 pb-3">
          Ingredientes
        </h2>
        <ul className="space-y-4">
          {displayIngredients.map((ing, i) => (
            <li key={i} className="flex flex-col text-stone-700">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <span className="font-medium leading-tight flex-1 min-w-0 pr-2">{ing.name}</span>
                <span className="text-sm text-stone-500 font-mono bg-stone-50 px-2 py-1 rounded shrink-0 w-fit sm:max-w-[60%] sm:text-right border border-stone-100 leading-snug">
                  {ing.quantity}&nbsp;{ing.unit}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
