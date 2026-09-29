import { login } from './actions'
import { Button } from '@/components/ui/button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-20">
      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <h1 className="text-3xl font-serif text-center mb-6">Acceso Privado</h1>
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
        />
        <label className="text-sm font-medium" htmlFor="password">
          Contraseña
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button formAction={login} className="w-full">
          Entrar
        </Button>
        {message && (
          <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center rounded-md text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
