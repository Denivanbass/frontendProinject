'use client'

import { useEffect, useState } from 'react'
import api from '@/service/api'
import Link from 'next/link'
import { OcorrenciaProps } from '../historico/page'

export default function DashboardPage() {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaProps[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  async function loadData() {
    try {
      setLoading(true)

      const response = await api.get('/ocorrencias')

      setOcorrencias(response.data || [])
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Erro ao carregar dados do painel.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const total = ocorrencias.length

  const abertas = ocorrencias.filter(
    (o) => o.status_ocorrencia.toLowerCase() === 'aberta'
  ).length

  const fechadas = total - abertas

  const moldesCount: Record<
    string,
    {
      cod: string
      versao: string
      qtd: number
    }
  > = {}

  ocorrencias.forEach((o) => {
    const cod = o.cavidade?.versao?.molde?.cod_molde || 'Outros'
    const versao = o.cavidade?.versao?.versao || 'Sem Versão'

    const key = `${cod} - ${versao}`

    if (!moldesCount[key]) {
      moldesCount[key] = {
        cod,
        versao,
        qtd: 0,
      }
    }

    moldesCount[key].qtd += 1
  })

  const moldesOrdenados = Object.values(moldesCount).sort(
    (a, b) => b.qtd - a.qtd
  )

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-140px)] w-full max-w-[1200px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <Link
          href="/gestao"
          className="mb-2 inline-block text-sm font-medium text-gray-design transition-colors hover:text-primary-design"
        >
          ← Voltar para Gestão
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-black-design sm:text-3xl">
          Dashboard
        </h1>
      </header>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-secondary-design bg-secondary-design/10 px-3 py-3 text-sm text-secondary-design">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-center text-gray-design">
          Carregando métricas...
        </p>
      ) : (
        <>
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-3 lg:gap-5">
            {/* Total */}
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-border-design/20 bg-black-design p-5 shadow-lg shadow-black-design/20 sm:p-6">
              <span className="text-sm font-medium text-gray-design">
                Total Ocorrências
              </span>

              <strong className="text-3xl font-bold text-primary-design sm:text-4xl">
                {total}
              </strong>
            </div>

            {/* Fechadas */}
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-border-design/20 bg-black-design p-5 shadow-lg shadow-black-design/20 sm:p-6">
              <span className="text-sm font-medium text-gray-design">
                Fechadas
              </span>

              <strong className="text-3xl font-bold text-red-500 sm:text-4xl">
                {fechadas}
              </strong>
            </div>

            {/* Abertas */}
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-border-design/20 bg-black-design p-5 shadow-lg shadow-black-design/20 sm:col-span-2 sm:p-6 lg:col-span-1">
              <span className="text-sm font-medium text-gray-design">
                Abertas
              </span>

              <strong className="text-3xl font-bold text-green-500 sm:text-4xl">
                {abertas}
              </strong>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-border-design/20 bg-black-design p-5 sm:p-6 lg:p-7">
            <h2 className="mb-5 text-xl font-semibold text-white-design">
              Ocorrências por Molde
            </h2>

            {moldesOrdenados.length === 0 ? (
              <p className="text-sm text-gray-design">
                Nenhum molde registrado ainda.
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-5 p-0">
                {moldesOrdenados.map((item, idx) => {
                  const percentual =
                    total > 0
                      ? Math.round((item.qtd / total) * 100)
                      : 0

                  return (
                    <li key={idx} className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <strong className="min-w-0 break-words text-white-design">
                          {item.cod}

                          <span className="ml-1 font-normal text-gray-design">
                            - {item.versao}
                          </span>
                        </strong>

                        <span className="shrink-0 text-xs text-gray-design sm:text-sm">
                          {item.qtd} ocorrência(s) ({percentual}%)
                        </span>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-bold-design/30">
                        <div
                          className="h-full rounded-full bg-primary-design transition-[width] duration-500 ease-out"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  )
}
