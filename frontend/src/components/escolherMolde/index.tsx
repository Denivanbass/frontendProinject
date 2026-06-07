'use client'

import { useState } from 'react';
import style from './escolherMolde.module.css'
import Link from 'next/link';

interface MoldesProps {
    moldesNoBanco: MoldesEncontradosNoBanco[];
}

interface MoldesEncontradosNoBanco {
    id_cavidade: number;
    molde: {
        id_molde: number;
        cod_molde: string;
    },
    versao: {
        id_versao: number;
        versao: string
    }
}

export default function EscolherMolde({ moldesNoBanco }: MoldesProps) {
    const [codigo_molde, setCodigo_molde] = useState('')
    const [codigo_versao, setCodigo_Versao] = useState('')



    // ✨ A MÁGICA ACONTECE AQUI: Filtrando para manter apenas combinações únicas
    const moldesUnicos = moldesNoBanco.filter((item, index, self) => {
        return self.findIndex(t =>
            t.molde.id_molde === item.molde.id_molde &&
            t.versao.id_versao === item.versao.id_versao
        ) === index;
    });



    return (
        <>
            <section className={style.moldes}>


                <h2>Selecione um molde:</h2>


                <ul className={style.card_list}>
                    {moldesUnicos.map((cav) => (


                        <li className={style.card_item} key={`${cav.molde.id_molde}-${cav.versao.id_versao}`}>

                            <Link href={`/molde/${cav.molde.cod_molde}/${cav.versao.versao}`}>
                                <p>{cav.molde.cod_molde} - {cav.versao.versao}</p>
                            </Link>

                        </li>

                    ))}
                </ul>

            </section>
        </>
    )
}