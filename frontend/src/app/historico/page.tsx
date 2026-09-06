'use client'

import { useEffect, useState } from 'react'
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
  defeito?: {
    id_defeito: number
    nome?: string
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
    const codMolde =
      item.cavidade?.versao?.molde?.cod_molde?.toLowerCase() || ''

    const versao =
      item.cavidade?.versao?.versao?.toLowerCase() || ''

    const nomeColaborador =
      item.colaborador?.nome?.toLowerCase() || ''

    const nomeDefeito = (
      item.defeito?.nome ||
      item.defeito?.descricao_defeito ||
      ''
    ).toLowerCase()

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

    // Pega somente a parte da data retornada pela API,
    // evitando conversão de timezone.
    const data = dataISO.split('T')[0]

    const [ano, mes, dia] = data.split('-')

    if (!ano || !mes || !dia) return '-'

    return `${dia}/${mes}/${ano}`
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-140px)] w-full max-w-[1200px] flex-col px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-10">
      {/* Header */}
      <header className="mb-5 sm:mb-6">
        <Link
          href="/gestao"
          className="mb-2 inline-block text-xs font-medium text-gray-design transition-colors duration-200 hover:text-primary-design sm:text-sm"
        >
          ← Voltar para Gestão
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-black-design sm:text-3xl">
          Histórico de Ocorrências
        </h1>
      </header>

      {/* Erro */}
      {errorMsg && (
        <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-3 text-xs leading-relaxed text-red-400 sm:mb-6 sm:text-sm">
          {errorMsg}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-5 flex w-full flex-col gap-3 sm:mb-6 sm:flex-row sm:gap-4">
        <input
          type="text"
          placeholder="Buscar por molde, cavidade, defeito ou colaborador..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-border-design/30 bg-black-design px-3 py-2.5 text-xs text-white-design outline-none transition-colors placeholder:text-gray-design focus:border-primary-design sm:px-4 sm:py-3 sm:text-sm"
        />

        <select
  value={filtroStatus}
  onChange={(e) => setFiltroStatus(e.target.value)}
  className="w-full cursor-pointer rounded-lg border border-gray-border-design/30 bg-black-design px-3 py-2.5 text-xs text-white-design outline-none transition-colors focus:border-primary-design focus:ring-1 focus:ring-primary-design/20 sm:w-auto sm:min-w-[190px] sm:px-4 sm:py-3 sm:text-sm"
>
  <option
    value="TODOS"
    className="bg-black-design text-white-design"
  >
    Todos os Status
  </option>

  <option
    value="ABERTA"
    className="bg-black-design text-white-design hover:bg-amber-100"
  >
    Abertas
  </option>

  <option
    value="FECHADA"
    className="bg-black-design text-white-design"
  >
    Fechadas
  </option>
</select>

      </div>

      {/* Loading */}
      {loading ? (
        <p className="mt-10 text-center text-sm text-gray-design">
          Carregando histórico...
        </p>
      ) : ocorrenciasFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-gray-border-design/20 bg-black-design px-4 py-12 text-center shadow-lg shadow-black-design/20 sm:px-6 sm:py-16">
          <h2 className="mb-2 text-lg font-semibold text-white-design sm:text-xl">
            Nenhuma ocorrência encontrada.
          </h2>

          <p className="text-xs text-gray-design sm:text-sm">
            Tente alterar o filtro ou o termo de busca.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-gray-border-design/20 bg-black-design shadow-lg shadow-black-design/20">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-border-design/20 bg-gray-bold-design/20">
                {/* ID */}
                <th className="w-[7%] px-1 py-2.5 text-center text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  ID
                </th>

                {/* Molde */}
                <th className="w-[17%] px-1 py-2.5 text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  Molde
                </th>

                {/* Cavidade */}
                <th className="w-[9%] px-1 py-2.5 text-center text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  Cav.
                </th>

                {/* Defeito */}
                <th className="w-[18%] px-1 py-2.5 text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  Defeito
                </th>

                {/* Colaborador */}
                <th className="w-[18%] px-1 py-2.5 text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  <span className="sm:hidden">Colab.</span>
                  <span className="hidden sm:inline">Colaborador</span>
                </th>

                {/* Status */}
                <th className="w-[13%] px-1 py-2.5 text-center text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  Status
                </th>

                {/* Data */}
                <th className="w-[18%] px-1 py-2.5 text-center text-[8px] font-semibold uppercase tracking-tight text-gray-design sm:px-2 sm:py-3 sm:text-[10px] md:px-3 md:py-4 md:text-xs">
                  Data
                </th>
              </tr>
            </thead>

            <tbody>
              {ocorrenciasFiltradas.map((item) => (
                <tr
                  key={item.id_ocorrencia}
                  className="border-b border-gray-border-design/10 transition-colors last:border-b-0 hover:bg-white/[0.02]"
                >
                  {/* ID */}
                  <td className="break-words px-1 py-3 text-center text-[9px] leading-tight text-gray-design sm:px-2 sm:py-3.5 sm:text-[11px] md:px-3 md:py-4 md:text-sm">
                    #{item.id_ocorrencia}
                  </td>

                  {/* Molde / Versão */}
                  <td className="break-words px-1 py-3 text-[9px] leading-tight sm:px-2 sm:py-3.5 sm:text-[11px] md:px-3 md:py-4 md:text-sm">
                    <strong className="font-semibold text-white-design">
                      {item.cavidade?.versao?.molde?.cod_molde || 'N/A'}
                    </strong>

                    <span className="text-gray-design">
                      {' '}
                      - {item.cavidade?.versao?.versao || 'N/A'}
                    </span>
                  </td>

                  {/* Cavidade */}
                  <td className="px-1 py-3 text-center text-[9px] leading-tight text-gray-design sm:px-2 sm:py-3.5 sm:text-[11px] md:px-3 md:py-4 md:text-sm">
                    {item.cavidade?.number ?? '-'}
                  </td>

                  {/* Defeito */}
                  <td className="break-words px-1 py-3 text-[9px] leading-tight text-gray-design sm:px-2 sm:py-3.5 sm:text-[11px] md:px-3 md:py-4 md:text-sm">
                    {item.defeito?.descricao_defeito || '-'}
                  </td>

                  {/* Colaborador */}
                  <td className="break-words px-1 py-3 text-[9px] leading-tight text-gray-design sm:px-2 sm:py-3.5 sm:text-[11px] md:px-3 md:py-4 md:text-sm">
                    {item.colaborador?.nome ||
                      `ID #${item.id_colaborador}`}
                  </td>

                  {/* Status */}
                  <td className="px-1 py-3 text-center sm:px-2 sm:py-3.5 md:px-3 md:py-4">
                    <span
                      className={`inline-flex max-w-full items-center justify-center whitespace-nowrap rounded-full border px-1.5 py-1 text-[7px] font-semibold uppercase leading-none sm:px-2 sm:py-1.5 sm:text-[9px] md:px-2.5 md:text-xs ${
                        item.status_ocorrencia.toLowerCase() === 'aberta'
                          ? 'border-green-500/40 bg-green-500/15 text-green-400'
                          : 'border-red-500/40 bg-red-500/15 text-red-400'
                      }`}
                    >
                      {item.status_ocorrencia}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="break-words px-1 py-3 text-center text-[9px] leading-tight text-gray-design sm:px-2 sm:py-3.5 sm:text-[11px] md:px-3 md:py-4 md:text-sm">
                    {formatData(item.created_at)}
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
