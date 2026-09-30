import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Recipe } from '@/types/database'
import { deleteRecipe } from './actions'
import { Edit, Trash2 } from 'lucide-react'

export default async function RecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const recipe = data as Recipe
  const isOwner = user?.id === recipe.user_id

  return (
    <div className="max-w-3xl mx-auto w-full py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm font-medium">
          ← Volver al inicio
        </Link>
        {isOwner && (
          <div className="flex gap-3">
            <Link href={`/editar/${recipe.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" /> Editar
              </Button>
            </Link>
            <form action={deleteRecipe.bind(null, recipe.id)}>
              <Button type="submit" variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" /> Eliminar
              </Button>
            </form>
          </div>
        )}
      </div>
      
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-2 leading-tight">
          {recipe.title}
        </h1>
        {recipe.author_name && (
          <p className="text-stone-500 font-medium mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs text-stone-600">
              {recipe.author_name.charAt(0).toUpperCase()}
            </span>
            Por {recipe.author_name}
          </p>
        )}
        {recipe.description && (
          <p className="text-lg text-stone-600 leading-relaxed bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
            {recipe.description}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Ingredientes */}
        <div className="w-full lg:w-2/5 shrink-0">
          <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
            <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-5 border-b border-stone-100 pb-3">
              Ingredientes
            </h2>
            <ul className="space-y-4">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="flex flex-col text-stone-700">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium leading-tight">{ing.name}</span>
                    <span className="text-sm text-stone-500 font-mono bg-stone-50 px-2 py-1 rounded w-fit sm:max-w-[60%] sm:text-right border border-stone-100 leading-snug">
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pasos */}
        <div className="w-full lg:w-3/5">
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-6 px-2">
            Preparación
          </h2>
          <div className="space-y-6">
            {recipe.steps?.map((step, i) => (
              <div key={i} className="flex gap-5 bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif text-xl border border-primary/20 leading-none pb-[2px]">
                  {i + 1}
                </div>
                <p className="text-stone-700 leading-relaxed pt-1.5 text-lg">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
