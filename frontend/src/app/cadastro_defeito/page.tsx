'use client'

import { useState, FormEvent } from 'react'
import style from './cadastro_defeito.module.css'
import api from '@/service/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroDefeitoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states (mantidos na UI)
  const [nomeDefeito, setNomeDefeito] = useState('')
  const [codDefeito, setCodDefeito] = useState('')
  const [gravidade, setGravidade] = useState('MEDIA')
  const [instrucoes, setInstrucoes] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      // Envia apenas o payload esperado pelo backend
      await api.post('/defeitos', {
        descricao_defeito: nomeDefeito,
      })

      router.push('/gestao')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(
        err?.response?.data?.message || 'Erro ao cadastrar o defeito.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={style.container}>
      <div className={style.header_actions}>
        <Link href="/gestao" className={style.btn_back}>
          ← Voltar para Gestão
        </Link>
        <h1 className={style.title}>Cadastrar Defeito</h1>
      </div>

      <form onSubmit={handleSubmit} className={style.card_form}>
        <h2>Informações do Defeito</h2>

        {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

        <div className={style.row}>
          <div className={style.input_group}>
            <label htmlFor="nomeDefeito">Descrição / Nome do Defeito *</label>
            <input
              id="nomeDefeito"
              type="text"
              placeholder="Ex: Queima, Chupagem, Rebarba"
              value={nomeDefeito}
              onChange={(e) => setNomeDefeito(e.target.value)}
              required
            />
          </div>

          <div className={style.input_group}>
            <label htmlFor="codDefeito">Código de Referência</label>
            <input
              id="codDefeito"
              type="text"
              placeholder="Ex: DEF-01"
              value={codDefeito}
              onChange={(e) => setCodDefeito(e.target.value)}
            />
          </div>
        </div>

        <div className={style.input_group}>
          <label htmlFor="gravidade">Nível de Gravidade</label>
          <select
            id="gravidade"
            value={gravidade}
            onChange={(e) => setGravidade(e.target.value)}
          >
            <option value="BAIXA">Baixa (Estética / Tolerável)</option>
            <option value="MEDIA">Média (Apenas retrabalho)</option>
            <option value="ALTA">Alta (Refugo imediato)</option>
            <option value="CRITICA">Crítica (Risco de dano ao molde)</option>
          </select>
        </div>

        <div className={style.input_group}>
          <label htmlFor="instrucoes">Observações / Ação Corretiva</label>
          <textarea
            id="instrucoes"
            rows={4}
            placeholder="Descreva detalhes visuais ou instruções para o operador..."
            value={instrucoes}
            onChange={(e) => setInstrucoes(e.target.value)}
          />
        </div>

        <button type="submit" className={style.btn_submit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Salvar Defeito'}
        </button>
      </form>
    </main>
  )
}