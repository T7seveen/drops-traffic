import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Drops Traffic — SaaS-инструменты для e-commerce трафика',
  description: '7 инструментов для дропшиппинга, арбитража трафика и SMM в одной подписке: юнит-экономика, мониторинг цен, аналитика каналов и реферальные программы.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={jakarta.variable}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
