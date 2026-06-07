"use client"
export const dynamic = 'force-dynamic';
import style from './page.module.css'

import api from "@/service/api"
import { useEffect, useState } from "react"




export default function Home() {

    const [ocorrencias, setOcorrencias] = useState<[]>([])


    useEffect(() => {

        const buscarOcorrencias = async () => {

            try {
                const response = await api.get('/ocorrencias')

                setOcorrencias(response.data)


            } catch (error) {
                console.log('Erro:', error)
            }

        };

        buscarOcorrencias();

    }, [])




    return (
        <>
            <h1 className={style.container1} >Histórico de Ocorrências:</h1>

            <ul>
                {ocorrencias.map((item: any) => (

                    <li key={item.id_ocorrencia}>

                        <p>Ocorrência Nº <strong>{item.id_ocorrencia}</strong></p>
                        <h2>{item.descricao}</h2>
                        <br />

                    </li>


                ))}
            </ul>


        </>



    )
}