'use client'
import logo from '../../../public/logoPRO.png'
import Image from 'next/image'




export default function Footer() {

    const currentYear = new Date().getFullYear()

    return (
        <>
            <div className='bg-gray-950 w-full'>

                <div className='w-full max-w-7xl m-auto p-6 flex flex-col justify-center items-center gap-2 md:flex-row md:justify-between'>

                    <Image
                        src={logo}
                        alt="Logo da Proinject"
                        loading='lazy'
                    />
                    <div >
                        <p className='text-sm text-gray-400' >© {currentYear} Proinject - Todos os direitos reservados.</p>
                    </div>
                    <p className='text-sm text-gray-400' >Desenvolvido por: Denivan Dias</p>


                </div>
            </div>

        </>
    )
}