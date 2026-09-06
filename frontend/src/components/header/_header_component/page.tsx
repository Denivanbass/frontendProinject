'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RemoveToken } from '@/_actions/_removeToken/page'
import logo from '../../../../public/logoPRO.png'
import { LogIn, LogOut, Menu } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"




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


  // Dados do menu de navegação:
  const menu = [
    { href: '/dashboard', nav: 'Dashboard' },
    { href: '/molde', nav: 'Moldes' },
    { href: '/gestao', nav: 'Gestão' },
    { href: '/historico', nav: 'Histórico' }
  ]

  return (
    <header className='bg-black-design w-full'>
      <div className='w-full max-w-7xl m-auto'>
        <div className=' flex justify-between items-center py-4 px-6 '>
          <Link href={isLogged ? '/dashboard' : '/login'}>
            <Image
              className='w-full min-w-40 min-h-auto'
              src={logo}
              alt="Logo Proinject"
              priority
            />
          </Link>


          {/*Navegação Desktop  */}
          {isLogged && (
            <nav className='hidden md:flex items-center gap-1 lg:gap-4'>
              {/* Map para renderizar o Menu de navegação */}
              {menu.map((item) => {
                return (
                  <Link key={item.href} href={item.href} className={` ${pathname.startsWith(item.href) ? 'text-primary-design bg-primary-design/20 p-2 rounded-md  text-base  ' : 'text-white-design/70 hover:bg-white-design/20 p-2 rounded-md hover:text-white duration-300 '}`}>
                    {item.nav}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger className={!isLogged ? 'hidden' : 'sm:block'}>
              <Menu className='text-white-design  size-10 md:hidden cursor-pointer' />
            </SheetTrigger>
            <SheetContent className='bg-black-design'>

              <SheetHeader className='border-b border-primary-design'>
                <SheetTitle className='text-3xl text-primary-design'>Menu</SheetTitle>
                <SheetDescription className='text-gray-border-design'>Escolha uma funcionalidade:</SheetDescription>
              </SheetHeader>

              <SheetClose className='w-ful p-4 flex flex-col text-start gap-4'>
                {menu.map((item) => {
                  return (
                    <Link key={item.href} href={item.href} className={` ${pathname.startsWith(item.href) ? 'text-primary-design bg-primary-design/20 p-2 rounded-md  text-lg  ' : 'text-gray-border-design hover:bg-gray-border-design/20 p-2 rounded-md hover:text-white-design duration-300 text-lg '}`}>
                      {item.nav}
                    </Link>
                  )
                })}
              </SheetClose>
              <SheetFooter>
                <SheetClose onClick={handleLogout} className=' bg-primary-design hover:bg-primary-design_hover duration-300 text-black-design font-bold p-4 rounded-lg flex items-center justify-center gap-2'>
                  <LogOut />
                  Sair
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>


          <div className='hidden md:block'>
            {isLogged ? (
              <button
                type="button"
                onClick={handleLogout}
                className='min-w-40 bg-primary-design hover:bg-primary-design_hover duration-300 text-black-design font-bold px-8 py-4 rounded-lg flex gap-4 '
              > <LogOut />
                Sair
              </button>

            ) : (
              <Link href="/login" >
                <button className='min-w-40 bg-primary-design hover:bg-primary-design_hover duration-300 text-black-design font-bold px-8 py-4 rounded-lg flex gap-4 '>
                  <LogIn />
                  Login
                </button>
              </Link>

            )}
          </div>
        </div>

      </div>
    </header>
  )
}