'use client';

import Link from 'next/link';
import style from './escolherMolde.module.css';
import { MoldeEncontradoProps } from '@/_actions/_getMoldes/page';

interface EscolherMoldeProps {
  moldesNoBanco: MoldeEncontradoProps[];
}

export default function EscolherMolde({ moldesNoBanco }: EscolherMoldeProps) {
  if (!moldesNoBanco || moldesNoBanco.length === 0) {
    return (
      <section className='w-full max-w-7xl bg-white-design p-4 flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-base font-bold' >Selecione um molde:</h2>
          <Link href="/cadastro_molde" className='bg-primary-design hover:bg-primary-design_hover rounded-lg p-2 font-bold'>
            + Adicionar Molde
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className='w-full h-screen bg-white-design   '>
      <div className='w-full max-w-7xl m-auto flex flex-col gap-4 p-6 sm:py-10 md:py-20'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-extrabold sm:text-3xl' >Moldes Encontrados</h2>
          <Link href="/cadastro_molde" className='bg-primary-design hover:bg-primary-design_hover duration-300 rounded-lg p-2 md:p-4 font-bold'>
            + Adicionar Molde
          </Link>
        </div>

        <ul className='flex flex-col gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 md:py-10 lg:grid-cols-4'>
          {moldesNoBanco.map((molde) =>
            molde.versao.map((v) => (
              <li
                className='bg-black-design text-white-design rounded-sm p-4 '
                key={`${molde.id_molde}-${v.id_versao}`}
              >
                <Link href={`/molde/${molde.cod_molde}/${v.versao}`}>
                  <p className='text-white-design'>
                    <strong >{molde.cod_molde}</strong> - {v.versao}
                  </p>
                  <p className='text-gray-border-design text-sm'>
                    {molde.description && <span>{molde.description}</span>}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}