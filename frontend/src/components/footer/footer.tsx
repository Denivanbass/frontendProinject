'use client'
import style from './footer.module.css'
import logo from '../../../public/logoPRO.png'




export default function Footer() {


    return (
        <>

            <div className={style.container_footer}>
                <img src={logo.src} alt="Logo da Proinject" />
                <p className={style.footer} >Desenvolvido por: Denivan Dias</p>
                
                
            </div>
        </>
    )
}