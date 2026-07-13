import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const configured = url && !url.includes('placeholder')

  if (!configured) return supabaseResponse

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        toSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect dashboard
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login?next=/dashboard', request.url))
  }

  // Protect blog admin
  if (path.startsWith('/blog/admin') && !user) {
    return NextResponse.redirect(new URL('/auth/login?next=/blog/admin/new', request.url))
  }

  // Redirect logged-in users away from auth pages
  if ((path === '/auth/login' || path === '/auth/register') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/blog/admin/:path*', '/auth/:path*'],
}
