'use client'

import { useState, FormEvent } from 'react'
import style from './cadastro_molde.module.css'
import api from '@/service/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NovoMoldePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [codMolde, setCodMolde] = useState('')
  const [versao, setVersao] = useState('PLAIN')
  const [descricao, setDescricao] = useState('')
  const [numCavidades, setNumCavidades] = useState<number>(48)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      await api.post('/molde/register', {
        cod_molde: codMolde,
        description: descricao,
        versao: versao,
        number: Number(numCavidades),
      })

      router.push('/molde')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.response?.data?.message || 'Erro ao cadastrar o molde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={style.container}>
      <div className={style.header_actions}>
        <Link href="/molde" className={style.btn_back}>
          ← Voltar para Moldes
        </Link>
        <h1 className={style.title}>Cadastrar Novo Molde</h1>
      </div>

      <div className={style.grid_layout}>
        <form onSubmit={handleSubmit} className={style.card_form}>
          <h2>Informações do Molde</h2>

          {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

          <div className={style.input_group}>
            <label htmlFor="codMolde">Código do Molde *</label>
            <input
              id="codMolde"
              type="text"
              placeholder="Ex: MP-2020"
              value={codMolde}
              onChange={(e) => setCodMolde(e.target.value)}
              required
            />
          </div>

          <div className={style.row}>
            <div className={style.input_group}>
              <label htmlFor="versao">Versão *</label>
              <input
                id="versao"
                type="text"
                placeholder="Ex: PLAIN"
                value={versao}
                onChange={(e) => setVersao(e.target.value)}
                required
              />
            </div>

            <div className={style.input_group}>
              <label htmlFor="numCavidades">Quantidade de Cavidades *</label>
              <input
                id="numCavidades"
                type="number"
                min={1}
                max={256}
                value={numCavidades}
                onChange={(e) => setNumCavidades(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className={style.input_group}>
            <label htmlFor="descricao">Descrição *</label>
            <textarea
              id="descricao"
              rows={3}
              placeholder="Ex: Past 20mm"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={style.btn_submit} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Salvar Molde'}
          </button>
        </form>

        <div className={style.card_preview}>
          <h3>Pré-visualização da Matriz</h3>
          <p>
            Serão geradas <strong>{numCavidades || 0}</strong> cavidades ativas inicialmente.
          </p>

          <div className={style.preview_grid}>
            {Array.from({ length: Math.min(numCavidades || 0, 32) }).map((_, index) => (
              <div key={index + 1} className={style.preview_card}>
                <span>{index + 1}</span>
              </div>
            ))}
            {(numCavidades || 0) > 32 && (
              <div className={style.preview_more}>
                +{(numCavidades || 0) - 32}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}