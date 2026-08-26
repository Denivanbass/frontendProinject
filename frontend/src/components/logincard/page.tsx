'use client'
import style from '@/components/logincard/loginCard.module.css'

import { useActionState, useEffect } from 'react'
import logo from '../../../public/icon.png'
import Image from 'next/image'
import { LoginAction } from '@/_actions/_loginAction/page'




export default function LoginCard() {
 const [state, formAction, isPending] = useActionState(LoginAction, null)



    return (
        <>
            <div className={style.section_login}>
                <form className={style.form} action={formAction}>
                    <Image
                        src={logo}
                        alt="Logo Proinject"
                        width={100}
                        height={100}
                    />
                    <h2>Login</h2>
                    <p className={style.errorLogin}>{state?.error ? 'email ou senha incorreto!' : ''}</p>

                    <div className={style.form_label}>
                        <div className={style.label_input}>
                            <label className={style.label} htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                className={style.input}
                                type="email"
                                name="email"
                                required
                                placeholder="seu email"
                            />
                        </div>

                        <div className={style.label_input}>
                            <label className={style.label} htmlFor="password">Senha</label>
                            <input
                                id="password"
                                className={style.input}
                                type="password"
                                name="password"
                                required
                                placeholder="*****"
                            />
                        </div>

                        <div className={style.entrar_btn}>
                            <button
                                type="submit"
                                className={style.btn_entrar}
                                disabled={isPending}
                            >
                                {isPending ? 'Enviando...' : 'Entrar'}
                            </button>

                            <p className={style.cadastre_se}>Esqueceu a senha?</p>
                        </div>
                    </div>
                </form>

            </div>

        </>
    )
}