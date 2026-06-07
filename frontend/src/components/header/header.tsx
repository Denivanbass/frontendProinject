'use client'
import style from './Header.module.css'
import logo from '../../../public/logoPRO.png'
import Link from 'next/link'
import { usePathname } from 'next/navigation'



export default function Header() {
    const pathname = usePathname()


    return (
        <>

            <div className={`${style.container_header}`}>
                <img src={logo.src} alt="Logo da Proinject" />
                <nav className={style.nav_container}>
                    <Link className={`${style.nav_link} ${pathname === '/rickandmorty'?style.link_ativo:''}`} href={'/rickandmorty'}>Dashboard</Link>
                    <Link className={`${style.nav_link} ${pathname === '/molde'?style.link_ativo:''}`} href={'/molde'}>Moldes</Link>
                    <Link className={`${style.nav_link} ${pathname === '/manutencao'?style.link_ativo:''}`} href={'/manutencao'}>Manutenção</Link>


                </nav>
                <Link className={style.btn_login} href={'/login'}>Login</Link>

            </div>
        </>
    )
}