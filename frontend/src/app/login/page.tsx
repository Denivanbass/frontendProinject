import style from './login.module.css'
import logo from '../../../public/icon.png'
import Image from 'next/image'


export default function Login() {

    return (
        <div className={style.section_login}>
            <form className={style.form} action="">
                <Image
                    className={''}
                    src={logo}
                    alt="Logo Proinject"
                    width={100}
                    height={100}
                />
                <h2>Login</h2>
                <div className={style.form_label}>

                    <div className={style.label_input}>
                        <label className={style.label} htmlFor="" >E-mail</label>
                        <input className={style.input} type="email" required placeholder='seu email'/>
                    </div>
                    <div className={style.label_input}>
                        <label className={style.label} htmlFor="">Senha</label>
                        <input className={style.input} type="password" required placeholder='*****'/>
                    </div>
                    <div className={style.entrar_btn}>
                        <button className={style.btn_entrar}>Entrar</button>
                        <p className={style.cadastre_se} >Cadastre-se</p>
                    </div>

                </div>
            </form>
        </div>
    )
}