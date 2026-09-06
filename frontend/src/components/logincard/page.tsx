'use client'

import { useActionState, useEffect } from 'react'
import logo from '../../../public/icon.png'
import Image from 'next/image'
import { LoginAction } from '@/_actions/_loginAction/page'




export default function LoginCard() {
    const [state, formAction, isPending] = useActionState(LoginAction, null)



    return (
        <>

            <div className='w-full py-20 px-4 bg-white-primary flex justify-center items-center '>

                <form className='border border-gray-border-design/50 rounded-lg w-full max-w-sm  p-6 shadow-lg shadow-gray-primary-shadow flex flex-col items-center gap-6' action={formAction}>
                    <Image
                        className='w-30 h-auto'
                        src={logo}
                        alt="Logo Proinject"
                        width={100}
                        height={100}
                    />
                    <h2 className='text-2xl font-bold text-secondary-design' >Login</h2>
                    <p className='text-red-500'>{state?.error ? 'Email / senha inválido!' : ''}</p>

                    <div className='w-full flex flex-col gap-4'>
                        <div className='flex justify-between items-center gap-2'>
                            <label className='text-gray-bold-design font-bold text-nowrap' htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                className='border border-gray-border-design rounded-sm w-full p-1 text-gray-bold-design font-base text-md'
                                type="email"
                                name="email"
                                required
                                placeholder="seu email"
                            />
                        </div>

                        <div className='flex justify-between items-center gap-2'>
                            <label className='text-gray-bold-design font-bold text-nowrap' htmlFor="password">Senha</label>
                            <input
                                id="password"
                                className='border border-gray-border-design rounded-sm w-full p-1  text-gray-bold-design font-base text-md'
                                type="password"
                                name="password"
                                required
                                placeholder="******"
                            />
                        </div>

                        <div className='flex flex-col gap-4 items-start'>
                            <button
                                type="submit"
                                className=' w-full p-4 rounded-lg bg-primary-design hover:bg-primary-design_hover duration-300 text-xl font-bold text-black-design '
                                disabled={isPending}
                            >
                                {isPending ? 'Enviando...' : 'Entrar'}
                            </button>

                            <p className='text-sm text-gray-bold-design hover:underline decoration-solid decoration-slate-500 underline-offset-4'>Esqueceu a senha?</p>
                        </div>
                    </div>
                </form>

            </div>


        </>
    )
}