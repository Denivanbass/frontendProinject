'use client'
import style from './footer.module.css'
import logo from '../../../public/logoPRO.png'
import Image from 'next/image'




export default function Footer() {

    const currentYear = new Date().getFullYear()

    return (
        <>

            <div className={style.container_footer}>
                
                <Image 
                 src={logo} alt="Logo da Proinject" 
                 loading='lazy'                
                />
                <div >
                    <p className={style.footer} >© {currentYear} Proinject - Todos os direitos reservados.</p>
                </div>
                <p className={style.footer} >Desenvolvido por: Denivan Dias</p>


            </div>
        </>
    )
}