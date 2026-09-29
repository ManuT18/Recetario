'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteRecipe(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Error al eliminar la receta')
  }

  revalidatePath('/')
  redirect('/')
}
