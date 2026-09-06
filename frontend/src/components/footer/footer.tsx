'use client'

import logo from '../../../public/logoPRO.png'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-gray-border-design/15 bg-black-design print:hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-3 px-4 py-5 sm:px-6 sm:py-6 md:flex-row md:justify-between">
        
        {/* Logo */}
        <Image
          src={logo}
          alt="Logo da Proinject"
          loading="lazy"
          className="h-auto w-[120px] sm:w-[130px]"
        />

        {/* Copyright */}
        <p className="text-center text-xs text-gray-design sm:text-sm">
          © {currentYear} Proinject - Todos os direitos reservados.
        </p>

        {/* Desenvolvedor */}
        <p className="text-center text-xs text-gray-design sm:text-sm">
          Desenvolvido por:{' '}
          <span className="font-medium text-gray-bold-design">
            Denivan Dias
          </span>
        </p>

      </div>
    </footer>
  )
}
