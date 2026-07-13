import { Header } from '@/components/Header'
import { Ticker } from '@/components/Ticker'
import { Hero } from '@/components/sections/Hero'
import { Tools } from '@/components/sections/Tools'
import { Stats } from '@/components/sections/Stats'
import { Spotlight } from '@/components/sections/Spotlight'
import { Blog } from '@/components/sections/Blog'
import { Pricing } from '@/components/sections/Pricing'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div style={{ background: '#FFFFFF', fontFamily: 'var(--font-jakarta), -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif', color: '#0F172A' }}>
      <Header />
      <Hero />
      <Ticker />
      <Tools />
      <Stats />
      <Spotlight />
      <Blog />
      <Pricing />
      <CtaBanner />
      <Footer />
    </div>
  )
}
