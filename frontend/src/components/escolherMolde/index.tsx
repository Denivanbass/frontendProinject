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
      <section className={style.moldes}>
        <div className={style.header}>
          <h2>Nenhum molde encontrado.</h2>
          <Link href="/cadastro_molde" className={style.btn_add}>
            + Adicionar Molde
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={style.moldes}>
      <div className={style.header}>
        <h2>Selecione um molde:</h2>
        <Link href="/cadastro_molde" className={style.btn_add}>
          + Adicionar Molde
        </Link>
      </div>

      <ul className={style.card_list}>
        {moldesNoBanco.map((molde) =>
          molde.versao.map((v) => (
            <li
              className={style.card_item}
              key={`${molde.id_molde}-${v.id_versao}`}
            >
              <Link href={`/molde/${molde.cod_molde}/${v.versao}`}>
                <p>
                  <strong>{molde.cod_molde}</strong> - {v.versao}
                </p>
                {molde.description && <span>{molde.description}</span>}
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}