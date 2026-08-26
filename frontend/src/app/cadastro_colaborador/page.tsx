'use client'

import { useState, FormEvent } from 'react'
import style from './cadastro_colaborador.module.css'
import api from '@/service/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroColaboradorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cargo, setCargo] = useState('Supervisor')
  const [senha, setSenha] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      await api.post('/colaborador/cadastro', {
        nome,
        email,
        cargo,
        senha,
      })

      router.push('/gestao')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(
        err?.response?.data?.message || 'Erro ao cadastrar o colaborador.'
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
        <h1 className={style.title}>Cadastrar Colaborador</h1>
      </div>

      <form onSubmit={handleSubmit} className={style.card_form}>
        <h2>Credenciais e Acesso</h2>

        {errorMsg && <div className={style.error_banner}>{errorMsg}</div>}

        <div className={style.row}>
          <div className={style.input_group}>
            <label htmlFor="nome">Nome Completo *</label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: Denivan"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={style.input_group}>
            <label htmlFor="email">E-mail *</label>
            <input
              id="email"
              type="email"
              placeholder="Ex: usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={style.row}>
          <div className={style.input_group}>
            <label htmlFor="cargo">Cargo / Função *</label>
            <select
              id="cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              required
            >
              <option value="Supervisor">Supervisor</option>
              <option value="Operador">Operador</option>
              <option value="Inspetor">Inspetor</option>
              <option value="Preparador">Preparador</option>
            </select>
          </div>

          <div className={style.input_group}>
            <label htmlFor="senha">Senha *</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className={style.btn_submit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Salvar Colaborador'}
        </button>
      </form>
    </main>
  )
}