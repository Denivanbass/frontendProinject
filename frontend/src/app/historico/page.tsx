'use client'

import { useEffect, useState } from 'react'
import style from './historico.module.css'
import api from '@/service/api'
import Link from 'next/link'

export interface OcorrenciaProps {
  id_ocorrencia: number
  id_cavidade: number
  id_colaborador: number
  id_defeito: number
  status_ocorrencia: string
  created_at: string
  colaborador?: {
    id_colaborador: number
    nome: string
  }
  defeito?: {                  // <--- Adicionado
    id_defeito: number
    nome?: string              // Ajuste conforme seu schema (ex: 'descricao' ou 'nome_defeito')
    descricao_defeito?: string
  }
  cavidade?: {
    id_cavidade: number
    number: number
    status: string
    id_versao: number
    updated_at: string
    versao?: {
      id_versao: number
      id_molde: number
      versao: string
      molde?: {
        id_molde: number
        cod_molde: string
        description?: string
      }
    }
  }
}

export default function HistoricoPage() {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaProps[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('TODOS')

  async function loadOcorrencias() {
    try {
      setLoading(true)
      const response = await api.get('/ocorrencias')
      setOcorrencias(response.data)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Erro ao carregar o histórico de ocorrências.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOcorrencias()
  }, [])

  const ocorrenciasFiltradas = ocorrencias.filter((item) => {
    const codMolde = item.cavidade?.versao?.molde?.cod_molde?.toLowerCase() || ''
    const versao = item.cavidade?.versao?.versao?.toLowerCase() || ''
    const nomeColaborador = item.colaborador?.nome?.toLowerCase() || ''
    const nomeDefeito = (item.defeito?.nome || item.defeito?.descricao_defeito || '').toLowerCase() // <--- Incluído na busca
    const termoBusca = busca.toLowerCase()

    const atendeBusca =
      codMolde.includes(termoBusca) ||
      versao.includes(termoBusca) ||
      nomeColaborador.includes(termoBusca) ||
      nomeDefeito.includes(termoBusca) ||
      String(item.cavidade?.number).includes(termoBusca)

    const atendeStatus =
      filtroStatus === 'TODOS' ||
      item.status_ocorrencia.toUpperCase() === filtroStatus.toUpperCase()

    return atendeBusca && atendeStatus
  })

  function formatData(dataISO: string) {
    if (!dataISO) return '-'
    const data = new Date(dataISO)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data)
  }

  return (
    <main className={style.container}>
      <div className={style.header}>
        <div>
          <Link href="/gestao" className={style.btn_back}>
            ← Voltar para Gestão
          </Link>
          <h1 className={style.title}>Histórico de Ocorrências</h1>
        </div>
      </div>

      {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

      <div className={style.filter_bar}>
        <input
          type="text"
          placeholder="Buscar por molde, cavidade, defeito ou colaborador..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={style.input_search}
        />

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className={style.select_filter}
        >
          <option value="TODOS">Todos os Status</option>
          <option value="ABERTA">Abertas</option>
          <option value="FECHADA">Fechadas</option>
        </select>
      </div>

      {loading ? (
        <p className={style.loading}>Carregando histórico...</p>
      ) : ocorrenciasFiltradas.length === 0 ? (
        <div className={style.empty_state}>
          <h2>Nenhuma ocorrência encontrada.</h2>
          <p>Tente alterar o filtro ou o termo de busca.</p>
        </div>
      ) : (
        <div className={style.table_wrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Molde / Versão</th>
                <th>Cavidade</th>
                <th>Defeito</th>
                <th>Colaborador</th>
                <th>Status</th>
                <th>Data do Apontamento</th>
              </tr>
            </thead>
            <tbody>
              {ocorrenciasFiltradas.map((item) => (
                <tr key={item.id_ocorrencia}>
                  <td>#{item.id_ocorrencia}</td>
                  <td className={style.molde_cell}>
                    <strong>
                      {item.cavidade?.versao?.molde?.cod_molde || 'N/A'}
                    </strong>
                    <span> - {item.cavidade?.versao?.versao || 'N/A'}</span>
                  </td>
                  <td>Cavidade {item.cavidade?.number ?? '-'}</td>

                  <td>
                    {item.defeito?.descricao_defeito}
                  </td>

                  <td>{item.colaborador?.nome || `ID #${item.id_colaborador}`}</td>

                  <td>
                    <span
                      className={`${style.status_badge} ${item.status_ocorrencia.toLowerCase() === 'aberta'
                          ? style.status_aberta
                          : style.status_fechada
                        }`}
                    >
                      {item.status_ocorrencia}
                    </span>
                  </td>
                  <td>{formatData(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}