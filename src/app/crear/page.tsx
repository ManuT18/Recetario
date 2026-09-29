'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { Trash2 } from 'lucide-react'
import type { Ingredient } from '@/types/database'

export default function CrearReceta() {
  const router = useRouter()
  const supabase = createClient()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '', unit: '' }])
  const [steps, setSteps] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)

  const handleAddIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }])
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleAddStep = () => setSteps([...steps, ''])
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }
  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const cleanIngredients = ingredients.filter(i => i.name.trim() !== '')
      const cleanSteps = steps.filter(s => s.trim() !== '')

      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          author_name: user.email ? user.email.split('@')[0] : 'Usuario',
          title,
          description,
          ingredients: cleanIngredients,
          steps: cleanSteps
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/receta/${data.id}`)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Hubo un error al guardar la receta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">Nueva Receta</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
          <div>
            <Label htmlFor="title" className="text-base font-semibold">Título</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ej: Pan de Masa Madre" 
              required 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-base font-semibold">Descripción (Opcional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Un poco de historia o tips sobre la receta..." 
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
          <Label className="text-xl font-serif font-semibold">Ingredientes</Label>
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 sm:gap-3 items-center">
              <Input 
                placeholder="Cant. (Ej: 200)" 
                value={ing.quantity} 
                onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} 
                className="w-1/4 sm:w-24"
              />
              <Select value={ing.unit} onValueChange={v => handleIngredientChange(index, 'unit', v || '')}>
                <SelectTrigger className="w-1/4 sm:w-36 bg-inherit">
                  <SelectValue placeholder="Unidad" />
                </SelectTrigger>
                <SelectContent>
                  {['grs', 'kg', 'ml', 'litros', 'cucharada(s)', 'cucharadita(s)', 'taza(s)', 'pizca', 'unidad(es)', 'al gusto'].map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                placeholder="Ingrediente (Ej: Harina)" 
                value={ing.name} 
                onChange={e => handleIngredientChange(index, 'name', e.target.value)} 
                className="flex-1"
              />
              {ingredients.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="text-stone-400 hover:text-destructive shrink-0" onClick={() => handleRemoveIngredient(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddIngredient} className="w-full border-dashed">
            + Agregar Ingrediente
          </Button>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
          <Label className="text-xl font-serif font-semibold">Pasos de Preparación</Label>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 sm:gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-semibold text-stone-500 mt-1">
                {index + 1}
              </span>
              <Textarea 
                placeholder={`Paso ${index + 1}...`} 
                value={step} 
                onChange={e => handleStepChange(index, e.target.value)} 
                className="flex-1 resize-none min-h-[80px]"
              />
              {steps.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="text-stone-400 hover:text-destructive shrink-0 mt-1" onClick={() => handleRemoveStep(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddStep} className="w-full border-dashed">
            + Agregar Paso
          </Button>
        </div>

        <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Receta'}
        </Button>
      </form>
    </div>
  )
}
