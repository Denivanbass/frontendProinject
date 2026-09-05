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
    <header className='bg-gray-950 w-full'>
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

          {isLogged && (
            <nav className='hidden md:flex items-center gap-1 lg:gap-4'>
              {/* Map para renderizar o Menu de navegação */}
              {menu.map((item) => {
                return (
                  <Link key={item.href} href={item.href} className={` ${pathname.startsWith(item.href) ? 'text-yellowTheme-500 bg-yellowTheme-500/20 p-2 rounded-md  text-base  ' : 'text-gray-300 hover:bg-gray-500/20 p-2 rounded-md hover:text-white duration-300 '}`}>
                    {item.nav}
                  </Link>
                )
              })}
            </nav>
          )}
          <Sheet>
            <SheetTrigger className={!isLogged? 'hidden': 'sm:block'}>
              <Menu className='text-white  size-10 md:hidden cursor-pointer' />
            </SheetTrigger>
            <SheetContent className='bg-gray-950'>

              <SheetHeader className='border-b border-yellowTheme-500'>
                <SheetTitle className='text-3xl text-yellowTheme-500 '>Menu</SheetTitle>
                <SheetDescription className='text-gray-400'>Escolha uma página:</SheetDescription>
              </SheetHeader>

              <SheetClose className='w-ful p-4 flex flex-col text-start gap-4'>
                {menu.map((item) => {
                  return (
                    <Link key={item.href} href={item.href} className={` ${pathname.startsWith(item.href) ? 'text-yellowTheme-500 bg-yellowTheme-500/20 p-2 rounded-md  text-xl  ' : 'text-gray-300 hover:bg-gray-500/20 p-2 rounded-md hover:text-white duration-300 '}`}>
                      {item.nav}
                    </Link>
                  )
                })}
              </SheetClose>


              <SheetFooter>

                <SheetClose onClick={handleLogout} className=' bg-yellowTheme-500 hover:bg-yellowTheme-600 duration-300 text-white font-bold p-4 rounded-lg flex items-center justify-center gap-2'>
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
                className='min-w-40 bg-yellowTheme-500 hover:bg-yellowTheme-600 duration-300 text-white font-bold px-8 py-4 rounded-lg flex gap-4 '
              > <LogOut />
                Sair
              </button>

            ) : (
              <Link href="/login" >
                <button className='min-w-40 bg-yellowTheme-500 hover:bg-yellowTheme-600 duration-300 text-white font-bold px-8 py-4 rounded-lg flex gap-4 '>
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