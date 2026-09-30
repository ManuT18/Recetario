import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Recetario Personal',
  description: 'Un lugar para guardar mis recetas de licores, panes y galletitas.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-[#fafaf9] text-[#1c1917] flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-5 md:p-8 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
