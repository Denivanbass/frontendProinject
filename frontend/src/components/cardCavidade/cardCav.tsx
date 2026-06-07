"use client"
import { useState, useRef, FormEvent, useEffect } from 'react';
import style from './cardCav.module.css'
import api from '@/service/api';
import { useRouter } from 'next/navigation';


interface CardCavProps {
    ListaCavidades: ListaCavidadesProps[];
    Colaboradores: colaboradoresProps[];
    Defeitos: DefeitosProps[];
}

interface ListaCavidadesProps {
    number: number;
    status: string;
    molde: { cod_molde: string };
    versao: { versao: string };
}

interface ocorrenciaProps {
    num_cav: number;
    codigo_molde: string;
    versao: string;
    descricao: string;
    id_defeito: number;
    id_colaborador: number;

}
interface DefeitosProps {
    id_defeito: number;
    descricao_defeito: string;
}

interface colaboradoresProps {
    id_colaborador: number;
    nome: string;
    cargo: string;
}

interface AbrirCavProps {
    cod_molde: string;
    versao: string;
    number: number;
}


export default function CardCav({ ListaCavidades, Colaboradores, Defeitos }: CardCavProps) {
    const [modalFecharCav, setModalFecharCav] = useState<boolean>(false)
    const [modalAbrirCav, setModalAbrirCav] = useState<boolean>(false)
    const [cavidadeSelecionada, setCavidadeSelecionada] = useState<number>()
    const descricaoRef = useRef<HTMLInputElement>(null)
    const defeitoRef = useRef<HTMLSelectElement>(null)
    const colaboradorRef = useRef<HTMLSelectElement>(null)
    const router = useRouter()


    const payloadFecharCav: ocorrenciaProps = {
        num_cav: 0,
        descricao: '',
        id_defeito: 0,
        codigo_molde: '',
        versao: '',
        id_colaborador: 1
    }
    const payloadAbrirCav: AbrirCavProps = {
        cod_molde: '',
        versao: '',
        number: 0
    }

    // capturar informações do formulario para fechar a cavidade
    async function handleSubmitFecharCav(e: FormEvent) {
        e.preventDefault()
        payloadFecharCav.num_cav = Number(cavidadeSelecionada)
        payloadFecharCav.descricao = descricaoRef.current?.value || ''
        payloadFecharCav.id_defeito = Number(defeitoRef.current?.value)
        payloadFecharCav.codigo_molde = ListaCavidades[0]?.molde.cod_molde
        payloadFecharCav.versao = ListaCavidades[0]?.versao.versao
        payloadFecharCav.id_colaborador = Number(colaboradorRef.current?.value)

        try {
            await fecharCavidade()

            router.refresh()
            fecharModal()
            limparForm()
        } catch (error) {
            console.log(error)
        }


    }

    // Capturar informações do formulario para abrir a cavidade
    async function handleSubmitAbrirCav(e: FormEvent) {
        e.preventDefault()
        payloadAbrirCav.number = Number(cavidadeSelecionada)
        payloadAbrirCav.cod_molde = ListaCavidades[0]?.molde.cod_molde
        payloadAbrirCav.versao = ListaCavidades[0]?.versao.versao

        try {

            await abrirCavidade()
            fecharModal()
            router.refresh()


        } catch (error) {
            console.log(error)
        }


    }

    // Limpar o formulario de fechar cavidade
    function limparForm() {
        if (descricaoRef.current && colaboradorRef.current) {
            descricaoRef.current.value = ''
        }
    }

    // Logica para abrir os modais de fechamento e abertura de cavidade
    function abrirModal(item_number: number, item_status: string) {
        if (item_status === 'Aberta' && modalFecharCav === false) {
            setCavidadeSelecionada(item_number)
            setModalFecharCav(true)
        }
        if (item_status === 'Fechada' && modalAbrirCav === false) {
            setCavidadeSelecionada(item_number)
            setModalAbrirCav(true)
        }

    }

    // Fechar os modais
    function fecharModal() {
        setModalFecharCav(false)
        setModalAbrirCav(false)
    }


    // Fechar a cavidade:
    async function fecharCavidade() {
        await api.post('/ocorrencia/registro',
            payloadFecharCav
        )
    }

    // Abrir a cavidade:
    async function abrirCavidade() {
        await api.put('/abrircavidade',
            payloadAbrirCav
        )
    }


    return (
        <>
            {ListaCavidades.map((item) => {
                return (

                    <li className={`${style.card_active} ${item.status === "Aberta" ? style.card_active : style.card_inactive}`} key={item.number} onClick={() => abrirModal(item.number, item.status)}>
                        <p className={`${style.cavidade} ${item.status === "Aberta" ? style.ativa : style.inativa}`}>{item.number}</p>
                        <p className={`${style.status} ${item.status === "Aberta" ? style.ativa : style.inativa}`}>{item.status} </p>
                    </li>
                )
            })}

            <div className={`${modalFecharCav === false ? style.modalFecharcavInativo : style.modalFecharcavAtivo} ${style.posicionamentoModal}`}>
                <button type='submit' onClick={fecharModal} ><strong>X</strong></button>

                <form onSubmit={handleSubmitFecharCav} >

                    <h2>Deseja fechar a cavidade <span className={style.inativa}>{cavidadeSelecionada}</span> ?</h2>
                    <label>Selecione o defeito:</label>
                    <ul>
                        <select ref={defeitoRef} name="" id="">
                            {Defeitos.map((defeito) => {
                                return (
                                    <option key={defeito.id_defeito} value={defeito.id_defeito}>{defeito.descricao_defeito}</option>
                                )
                            })}
                        </select>

                    </ul>


                    <label>Colaborador:</label>
                    <ul>
                        <select ref={colaboradorRef} name="" id="">
                            {Colaboradores.map((colaborador) => {
                                return (
                                    <option key={colaborador.id_colaborador} value={colaborador.id_colaborador}>{colaborador.nome}</option>
                                )
                            })}
                        </select>

                    </ul>

                    <button type='submit'>Fechar cavidade</button>
                </form>

            </div>





            <div className={`${modalAbrirCav === false ? style.modalFecharcavInativo : style.modalFecharcavAtivo} ${style.posicionamentoModal}`}>
                <button type='submit' onClick={fecharModal} ><strong>X</strong></button>


                <form onSubmit={handleSubmitAbrirCav} >

                    <h2>Deseja abrir a cavidade <span className={style.inativa}>{cavidadeSelecionada}</span> ?</h2>


                    <label>Colaborador:</label>
                    <ul>
                        <select ref={colaboradorRef} name="" id="">
                            {Colaboradores.map((colaborador) => {
                                return (
                                    <option key={colaborador.id_colaborador} value={colaborador.id_colaborador}>{colaborador.nome}</option>
                                )
                            })}
                        </select>

                    </ul>

                    <button type='submit'>Abrir cavidade</button>
                </form>
            </div>

        </>
    )
}


