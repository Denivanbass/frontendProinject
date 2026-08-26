'use client'

import { useEffect, useState } from 'react'
import style from './defeitos.module.css'
import api from '@/service/api'
import Link from 'next/link'

interface DefeitoProps {
  id_defeito?: string
  id?: string
  descricao_defeito: string
}

export default function DefeitosPage() {
  const [defeitos, setDefeitos] = useState<DefeitoProps[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  async function loadDefeitos() {
    try {
      setLoading(true)
      const response = await api.get('/defeitos')
      setDefeitos(response.data)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Não foi possível carregar a lista de defeitos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDefeitos()
  }, [])

  return (
    <main className={style.container}>
      <div className={style.header}>
        <div>
          <Link href="/gestao" className={style.btn_back}>
            ← Voltar para Gestão
          </Link>
          <h1 className={style.title}>Catálogo de Defeitos</h1>
        </div>
        <Link href="/cadastro_defeito" className={style.btn_add}>
          + Novo Defeito
        </Link>
      </div>

      {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

      {loading ? (
        <p className={style.loading}>Carregando defeitos...</p>
      ) : defeitos.length === 0 ? (
        <div className={style.empty_state}>
          <h2>Nenhum defeito cadastrado.</h2>
          <p>
            Cadastre os tipos de defeitos para que os operadores possam
            selecioná-los durante a inspeção.
          </p>
          <Link href="/cadastro_defeito" className={style.btn_add}>
            + Cadastrar Defeito
          </Link>
        </div>
      ) : (
        <ul className={style.card_list}>
          {defeitos.map((defeito, index) => (
            <li
              key={defeito.id_defeito || defeito.id || index}
              className={style.card_item}
            >
              <div className={style.card_info}>
                <span className={style.badge}>
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <h3>{defeito.descricao_defeito}</h3>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}