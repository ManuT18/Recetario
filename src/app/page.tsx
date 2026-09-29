import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import type { Recipe } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()

  // Fetch public recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold text-stone-800">Tus Recetas</h1>
          <p className="text-stone-500 mt-2">Explora y descubre tus preparaciones caseras.</p>
        </div>
      </div>

      {!recipes || recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-200 border-dashed">
          <p className="text-stone-500 mb-4">Aún no hay recetas guardadas.</p>
          <Link href="/crear" className="text-primary font-medium hover:underline">
            ¡Agrega tu primera receta!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(recipes as Recipe[]).map((recipe) => (
            <Link key={recipe.id} href={`/receta/${recipe.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer bg-white border-stone-200">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="font-serif text-xl">{recipe.title}</CardTitle>
                    {recipe.author_name && (
                      <span className="text-xs font-medium px-2 py-1 bg-stone-100 text-stone-600 rounded-full shrink-0">
                        Por {recipe.author_name}
                      </span>
                    )}
                  </div>
                  {recipe.description && (
                    <CardDescription className="line-clamp-2 mt-2">{recipe.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span>{recipe.ingredients?.length || 0} Ingredientes</span>
                    <span>{recipe.steps?.length || 0} Pasos</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
