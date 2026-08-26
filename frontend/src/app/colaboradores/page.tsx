'use client'

import { useEffect, useState } from 'react'
import style from './colaboradores.module.css'
import api from '@/service/api'
import Link from 'next/link'

interface ColaboradorProps {
  id?: string
  id_colaborador?: string
  nome: string
  email: string
  cargo?: string
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<ColaboradorProps[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  async function loadColaboradores() {
    try {
      setLoading(true)
      const response = await api.get('/colaborador')
      setColaboradores(response.data)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Não foi possível carregar a lista de colaboradores.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadColaboradores()
  }, [])

  return (
    <main className={style.container}>
      <div className={style.header}>
        <div>
          <Link href="/gestao" className={style.btn_back}>
            ← Voltar para Gestão
          </Link>
          <h1 className={style.title}>Colaboradores Cadastrados</h1>
        </div>
        <Link href="/cadastro_colaborador" className={style.btn_add}>
          + Novo Colaborador
        </Link>
      </div>

      {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

      {loading ? (
        <p className={style.loading}>Carregando colaboradores...</p>
      ) : colaboradores.length === 0 ? (
        <div className={style.empty_state}>
          <h2>Nenhum colaborador encontrado.</h2>
          <p>Cadastre os membros da equipe para liberar acesso ao sistema.</p>
          <Link href="/cadastro_colaborador" className={style.btn_add}>
            + Cadastrar Colaborador
          </Link>
        </div>
      ) : (
        <div className={style.table_wrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.map((colab, idx) => (
                <tr key={colab.id || colab.id_colaborador || idx}>
                  <td className={style.nome_cell}>{colab.nome}</td>
                  <td className={style.email_cell}>{colab.email}</td>
                  <td>
                    <span className={style.badge}>
                      {colab.cargo || 'Operador'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}