'use client'

import { SinistresProvider } from '@/contexts/SinistresContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import MainApp from '@/components/MainApp'

export default function Home() {
  return (
    <ThemeProvider>
      <SinistresProvider>
        <MainApp />
      </SinistresProvider>
    </ThemeProvider>
  )
}
