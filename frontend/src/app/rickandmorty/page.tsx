'use client'

import apiRickAndMorty from "@/service/apiRickAndMorty"
import { useEffect, useState } from "react"
import style from './page.module.css'

export default function RickandMorty() {
    const [personagens, setPersonagens] = useState<[]>([])


    useEffect(() => {

        const buscarPersonagens = async () => {

            try {

                const personagens = await apiRickAndMorty.get('/character')
                setPersonagens(personagens.data.results)

            } catch (error) {
                console.log(error)
            }


        }

        buscarPersonagens();
    }, [])


    return (
        <>
            <h1>Ricky and Morty</h1>
            <br />
            <div className={style.container_area}>
                <ul className={style.container_grid}>
                    {
                        personagens.map((item: any) => (
                            <li className={style.item} key={item.id}>
                                <h2>{item.name} </h2>
                                <img src={item.image} alt={item.name} />
                                <p>Origem: <strong>{item.origin.name}</strong></p>
                                <p>Espécie: <strong>{item.species}</strong></p>
                                <p>status: <strong>{item.status}</strong></p>
                                <br />
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}