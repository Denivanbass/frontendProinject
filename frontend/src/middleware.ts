// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

// Esta função roda antes de qualquer rota especificada no 'matcher'
export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token salvo nos cookies
  const token = request.cookies.get('token')?.value;

  // 2. Se não tiver o token, redireciona o usuário para o login
  if (!token) {
    // request.url é necessário para criar uma URL absoluta para o redirecionamento
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Se tiver o token, deixa o usuário seguir em frente
  return NextResponse.next();
}

// 4. A MÁGICA ESTÁ AQUI: O Matcher
// Aqui você diz ao Next.js em quais rotas esse middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Protege todas as rotas que começam com /dashboard e /perfil.
     * O /:path* significa que protege também as sub-rotas (ex: /dashboard/configuracoes)
     */
    '/cadastro_colaborador/:path*',
    '/cadastro_defeito/:path*',
    '/cadastro_molde/:path*',
    '/colaboradores/:path*',
    '/dashboard/:path*',
    '/defeitos/:path*',
    '/gestao/:path*',
    '/historico/:path*',
    '/manutencao/:path*',
    '/molde/:path*'
  ],
};