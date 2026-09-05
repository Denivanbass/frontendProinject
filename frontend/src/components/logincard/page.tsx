'use client'

import { useActionState, useEffect } from 'react'
import logo from '../../../public/icon.png'
import Image from 'next/image'
import fabrica from '../../../public/proinject-fab.webp'
import { LoginAction } from '@/_actions/_loginAction/page'




export default function LoginCard() {
    const [state, formAction, isPending] = useActionState(LoginAction, null)



    return (
        <>

            <div className='w-full py-22 bg-white flex justify-center items-center '>

                <form className='border border-gray-300 rounded-lg w-full max-w-sm p-10 shadow-lg shadow-gray-300 flex flex-col items-center gap-8' action={formAction}>
                    <Image
                        className='w-30 h-30'
                        src={logo}
                        alt="Logo Proinject"
                        width={100}
                        height={100}
                    />
                    <h2 className='text-2xl font-bold text-yellowTheme-500' >Login</h2>
                    <p className='text-red-500'>{state?.error ? 'Email / senha inválido!' : ''}</p>

                    <div className='w-full flex flex-col gap-4'>
                        <div className='flex justify-between items-center gap-2'>
                            <label className='text-gray-500 font-bold text-nowrap' htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                className='border border-gray-400 rounded-sm w-full p-1 focus:outline-yellowTheme-500 text-gray-600 font-medium text-lg'
                                type="email"
                                name="email"
                                required
                                placeholder="seu email"
                            />
                        </div>

                        <div className='flex justify-between items-center gap-2'>
                            <label className='text-gray-500 font-bold text-nowrap' htmlFor="password">Senha</label>
                            <input
                                id="password"
                                className='border border-gray-400 rounded-sm w-full p-1 focus:outline-yellowTheme-500 text-gray-600 font-medium text-lg'
                                type="password"
                                name="password"
                                required
                                placeholder="******"
                            />
                        </div>

                        <div className='flex flex-col gap-4 items-start'>
                            <button
                                type="submit"
                                className=' w-full p-4 rounded-lg bg-yellowTheme-500 hover:bg-yellowTheme-600 duration-300 text-xl font-bold text-white '
                                disabled={isPending}
                            >
                                {isPending ? 'Enviando...' : 'Entrar'}
                            </button>

                            <p className='text-sm text-gray-500 hover:underline decoration-solid decoration-gray-500 underline-offset-4'>Esqueceu a senha?</p>
                        </div>
                    </div>
                </form>

            </div>


        </>
    )
}