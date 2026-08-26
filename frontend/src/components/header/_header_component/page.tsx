'use client'

import style from './header_component.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { lazy, useEffect, useState } from 'react'
import { RemoveToken } from '@/_actions/_removeToken/page'
import logo from '../../../../public/logoPRO.png'

interface TokenProps {
  token?: string
}

export default function HeaderComponent({ token }: TokenProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLogged, setIsLogged] = useState<boolean>(false)

  useEffect(() => {
    setIsLogged(!!token)
  }, [token])

  async function handleLogout() {
    try {
      await RemoveToken()
      setIsLogged(false)
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Erro ao realizar logout:', error)
    }
  }

  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link href={isLogged ? '/dashboard' : '/login'} className={style.logo_link}>
          <Image
            src={logo}
            alt="Logo Proinject"
            priority            
            className={style.logo_img}   
          />
        </Link>

        {isLogged && (
          <nav className={style.nav}>
            <Link
              href="/dashboard"
              className={`${style.nav_link} ${
                pathname === '/dashboard' ? style.active : ''
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/molde"
              className={`${style.nav_link} ${
                pathname.startsWith('/molde') ? style.active : ''
              }`}
            >
              Moldes
            </Link>

            <Link
              href="/gestao"
              className={`${style.nav_link} ${
                pathname.startsWith('/gestao') ? style.active : ''
              }`}
            >
              Gestão
            </Link>

            <Link
              href="/historico"
              className={`${style.nav_link} ${
                pathname === '/historico' ? style.active : ''
              }`}
            >
              Histórico
            </Link>
          </nav>
        )}

        <div className={style.actions}>
          {isLogged ? (
            <button
              type="button"
              onClick={handleLogout}
              className={style.btn_logout}
            >
              Sair
            </button>
          ) : (
            <Link href="/login" className={style.btn_login}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}