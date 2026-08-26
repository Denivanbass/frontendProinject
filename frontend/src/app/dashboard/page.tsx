'use client'

import { useEffect, useState } from 'react'
import style from './dashboard.module.css'
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

  // Métricas
  const total = ocorrencias.length
  const abertas = ocorrencias.filter(
    (o) => o.status_ocorrencia.toLowerCase() === 'aberta'
  ).length
  const fechadas = total - abertas

  // Agrupamento por Molde e Versão
  const moldesCount: Record<string, { cod: string; versao: string; qtd: number }> = {}

  ocorrencias.forEach((o) => {
    const cod = o.cavidade?.versao?.molde?.cod_molde || 'Outros'
    const versao = o.cavidade?.versao?.versao || 'Sem Versão'
    const key = `${cod} - ${versao}`

    if (!moldesCount[key]) {
      moldesCount[key] = { cod, versao, qtd: 0 }
    }
    moldesCount[key].qtd += 1
  })

  const moldesOrdenados = Object.values(moldesCount).sort((a, b) => b.qtd - a.qtd)

  return (
    <main className={style.container}>
      <div className={style.header}>
        <div>
          <Link href="/gestao" className={style.btn_back}>
            ← Voltar para Gestão
          </Link>
          <h1 className={style.title}>Dashboard</h1>
        </div>
      </div>

      {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

      {loading ? (
        <p className={style.loading}>Carregando métricas...</p>
      ) : (
        <>
          <section className={style.cards_grid}>
            <div className={style.card_kpi}>
              <span className={style.kpi_label}>Total Ocorrências</span>
              <strong className={style.kpi_value}>{total}</strong>
            </div>

            <div className={`${style.card_kpi} ${style.card_alert}`}>
              <span className={style.kpi_label}>Fechadas</span>
              <strong className={style.kpi_value_red}>{fechadas}</strong>
            </div>

            <div className={style.card_kpi}>
              <span className={style.kpi_label}>Solucionadas</span>
              <strong className={style.kpi_value_green}>{abertas}</strong>
            </div>
          </section>

          <section className={style.section_details}>
            <h2>Ocorrências</h2>
            {moldesOrdenados.length === 0 ? (
              <p className={style.empty}>Nenhum molde registrado ainda.</p>
            ) : (
              <ul className={style.ranking_list}>
                {moldesOrdenados.map((item, idx) => {
                  const percentual = total > 0 ? Math.round((item.qtd / total) * 100) : 0
                  return (
                    <li key={idx} className={style.ranking_item}>
                      <div className={style.ranking_info}>
                        <strong>{item.cod} <span style={{ fontWeight: 'normal', opacity: 0.5, fontSize: 14 }}> - {item.versao}</span></strong>
                        <span>{item.qtd} ocorrência(s) ({percentual}%)</span>
                      </div>
                      <div className={style.bar_bg}>
                        <div
                          className={style.bar_fill}
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