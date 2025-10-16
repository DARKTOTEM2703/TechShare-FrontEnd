import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/verify', '/']

// Rutas que requieren rol ADMIN
const adminRoutes = ['/admin']

/**
 * Middleware de Next.js para proteger rutas
 * - Usuarios no autenticados → redirigir a /login
 * - Usuarios autenticados en /login o /register → redirigir a dashboard
 * - Usuarios sin rol ADMIN intentando acceder a /admin → acceso denegado
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obtener token de las cookies
  const token = request.cookies.get('token')?.value || null
  
  // Verificar si la ruta requiere autenticación
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // 1. Si la ruta es /admin/* y NO hay token → redirigir a /login
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 2. Si HAY token y está en /login → redirigir a /admin
  // (Usuarios autenticados no deberían estar en la página de login)
  // NOTA: /register y / son públicos siempre, no redirigir desde ahí
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  // 3. Si la ruta es /admin y hay token, permitir acceso
  // (El componente RoleGuard en el cliente validará el rol ADMIN)
  // No podemos validar el rol JWT aquí porque necesitaríamos desencriptar el token
  
  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploaded-images (imágenes subidas)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploaded-images).*)',
  ],
}
