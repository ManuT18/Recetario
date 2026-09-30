import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center h-16 px-5">
        <Link href="/" className="font-bold text-2xl font-serif text-primary">
          Recetario.
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/crear">
                <Button variant="default" size="sm">Nueva Receta</Button>
              </Link>
              <form action={logout}>
                <Button type="submit" variant="ghost" size="sm">Salir</Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">Ingresar</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
