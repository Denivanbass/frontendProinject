'use client'

import { useState, FormEvent } from 'react'
import api from '@/service/api'
import { useRouter } from 'next/navigation'
import {
  CavidadeProps,
  ColaboradorProps,
  DefeitoProps,
} from '@/app/molde/[codigo_molde]/[codigo_versao]/page'

interface CardCavProps {
  ListaCavidades: CavidadeProps[]
  Colaboradores: ColaboradorProps[]
  Defeitos: DefeitoProps[]
  codigo_molde: string
  codigo_versao: string
}

export default function CardCav({
  ListaCavidades,
  Colaboradores,
  Defeitos,
  codigo_molde,
  codigo_versao,
}: CardCavProps) {
  const [modalFecharCav, setModalFecharCav] = useState(false)
  const [modalAbrirCav, setModalAbrirCav] = useState(false)

  const [cavidadeSelecionada, setCavidadeSelecionada] = useState<
    number | null
  >(null)

  const [defeitoId, setDefeitoId] = useState('')
  const [colaboradorId, setColaboradorId] = useState('')
  const [descricao, setDescricao] = useState('')

  const router = useRouter()

  const codMoldeFormatado = decodeURIComponent(codigo_molde)
  const versaoFormatada = decodeURIComponent(codigo_versao)

  // ==========================================
  // FECHAR CAVIDADE
  // ==========================================

  async function handleSubmitFecharCav(e: FormEvent) {
    e.preventDefault()

    if (!cavidadeSelecionada) return

    const payload = {
      num_cav: Number(cavidadeSelecionada),
      descricao,
      id_defeito: Number(defeitoId),
      cod_molde: codMoldeFormatado,
      codigo_molde: codMoldeFormatado,
      versao: versaoFormatada,
      id_colaborador: Number(colaboradorId),
    }

    try {
      await api.post('/ocorrencia/registro', payload)

      fecharModal()
      router.refresh()
    } catch (error) {
      console.error(
        'Erro ao registrar fechamento de cavidade:',
        error
      )
    }
  }

  // ==========================================
  // ABRIR CAVIDADE
  // ==========================================

  async function handleSubmitAbrirCav(e: FormEvent) {
    e.preventDefault()

    if (!cavidadeSelecionada) return

    const payload = {
      cod_molde: codMoldeFormatado,
      versao: versaoFormatada,
      number: Number(cavidadeSelecionada),
      num_cav: Number(cavidadeSelecionada),
      id_colaborador: Number(colaboradorId),
    }

    try {
      await api.put('/abrircavidade', payload)

      fecharModal()
      router.refresh()
    } catch (error) {
      console.error(
        'Erro ao reabrir cavidade:',
        error
      )
    }
  }

  // ==========================================
  // ABRIR MODAL
  // ==========================================

  function abrirModal(
    itemNumber: number,
    itemStatus: string
  ) {
    setCavidadeSelecionada(itemNumber)

    if (Defeitos.length > 0) {
      setDefeitoId(
        String(Defeitos[0].id_defeito)
      )
    }

    if (Colaboradores.length > 0) {
      setColaboradorId(
        String(Colaboradores[0].id_colaborador)
      )
    }

    if (itemStatus === 'Aberta') {
      setModalFecharCav(true)
    } else if (itemStatus === 'Fechada') {
      setModalAbrirCav(true)
    }
  }

  // ==========================================
  // FECHAR MODAL
  // ==========================================

  function fecharModal() {
    setModalFecharCav(false)
    setModalAbrirCav(false)
    setCavidadeSelecionada(null)
    setDescricao('')
    setDefeitoId('')
    setColaboradorId('')
  }

  return (
    <>
      {/* ==========================================
          CAVIDADES
      ========================================== */}

      {ListaCavidades.map((item) => {
        const aberta = item.status === 'Aberta'

        return (
          <li
            key={item.number}
            onClick={() =>
              abrirModal(
                item.number,
                item.status
              )
            }
            className={[
              // Classe específica para impressão
              'print-cavity-card',

              // Card normal
              'group relative',
              'h-[60px] w-[60px]',
              'cursor-pointer',
              'rounded-lg',
              'border',
              'bg-white-design',
              'shadow-sm',
              'transition-all duration-200 ease-out',

              // Hover
              'hover:-translate-y-0.5',
              'hover:shadow-md',

              // Estado
              aberta
                ? 'border-cyan-700 '
                : 'border-red-500 hover:border-red-500',
            ].join(' ')}
          >
            {/* ==========================================
                INDICADOR DE STATUS
            ========================================== */}

            <span
              className={[
                // Classe específica para impressão
                'print-cavity-indicator',

                'absolute right-1.5 top-1.5',
                'h-1.5 w-1.5',
                'rounded-full',

                aberta
                  ? ''
                  : '',
              ].join(' ')}
            />

            {/* ==========================================
                NÚMERO DA CAVIDADE
            ========================================== */}

            <p
              className={[
                // Classe específica para impressão
                'print-cavity-number',

                'flex h-[68%]',
                'items-center justify-center',
                'text-base font-bold',
                'leading-none',
                aberta
                  ? 'text-cyan-700'
                  : 'text-red-500',
              ].join(' ')}
            >
              {item.number}
            </p>

            {/* ==========================================
                STATUS
            ========================================== */}

            <p
              className={[
                // Classe específica para impressão
                'print-cavity-status',

                'flex h-[32%]',
                'items-center justify-center',
                'text-[9px] font-medium',
                'leading-none',
                'uppercase tracking-wide',

                aberta
                  ? 'text-cyan-700'
                  : 'text-red-500',
              ].join(' ')}
            >
              {item.status}
            </p>
          </li>
        )
      })}

      {/* ==========================================
          OVERLAY
      ========================================== */}

      {(modalFecharCav || modalAbrirCav) && (
        <div
          className="fixed inset-0 z-[999] bg-black-design/40 backdrop-blur-[2px]"
          onClick={fecharModal}
        />
      )}

      {/* ==========================================
          MODAL FECHAR CAVIDADE
      ========================================== */}

      <div
        className={[
          !modalFecharCav
            ? 'hidden'
            : 'block',

          // Posicionamento
          'fixed left-1/2 top-1/2',
          '-translate-x-1/2 -translate-y-1/2',
          'z-[1000]',

          // Responsividade
          'w-[calc(100%-24px)]',
          'max-w-[460px]',

          // Espaçamento
          'p-5 sm:p-7 md:p-8',

          // Visual
          'rounded-xl',
          'border border-slate-200',
          'bg-black-design',
          'text-white-design',
          'shadow-xl shadow-black-design/20',
        ].join(' ')}
      >
        {/* Fechar */}

        <button
          type="button"
          onClick={fecharModal}
          aria-label="Fechar modal"
          className={[
            'absolute right-4 top-4',
            'flex h-8 w-8',
            'items-center justify-center',
            'rounded-full',
            'bg-transparent',
            'text-gray-design',
            'transition-colors duration-200',
            'hover:bg-white/10',
            'hover:text-white-design',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-primary-design/40',
          ].join(' ')}
        >
          <strong className="text-base font-medium">
            X
          </strong>
        </button>

        <form
          onSubmit={handleSubmitFecharCav}
          className="flex flex-col gap-4"
        >
          {/* Título */}

          <h2
            className={[
              'mb-1',
              'pr-8',
              'text-[1.1rem]',
              'font-semibold',
              'leading-[1.4]',
              'sm:text-[1.2rem]',
            ].join(' ')}
          >
            Deseja fechar a cavidade{' '}
            <span className="text-red-500">
              {cavidadeSelecionada}
            </span>{' '}
            do molde{' '}
            <strong className="text-primary-design">
              {codMoldeFormatado}
            </strong>
            ?
          </h2>

          {/* Defeito */}

          <label
            htmlFor="defeito"
            className="mb-[-8px] text-sm font-medium text-gray-border-design"
          >
            Selecione o defeito:
          </label>

          <select
            id="defeito"
            value={defeitoId}
            onChange={(e) =>
              setDefeitoId(e.target.value)
            }
            required
            className={[
              'w-full',
              'rounded-lg',
              'border border-gray-border-design/30',
              'bg-gray-bold-design/20',
              'px-3 py-2.5',
              'text-sm',
              'text-white-design',
              'outline-none',
              'transition-all duration-200',
              'focus:border-primary-design',
              'focus:ring-2',
              'focus:ring-primary-design/20',
            ].join(' ')}
          >
            {Defeitos.map((defeito) => (
              <option
                key={defeito.id_defeito}
                value={defeito.id_defeito}
                className="bg-black-design"
              >
                {defeito.descricao_defeito}
              </option>
            ))}
          </select>

          {/* Descrição */}

          <label
            htmlFor="descricao"
            className="mb-[-8px] text-sm font-medium text-gray-border-design"
          >
            Descrição / Observação:
          </label>

          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) =>
              setDescricao(e.target.value)
            }
            placeholder="Detalhes adicionais (opcional)"
            className={[
              'w-full',
              'rounded-lg',
              'border border-gray-border-design/30',
              'bg-gray-bold-design/20',
              'px-3 py-2.5',
              'text-sm',
              'text-white-design',
              'placeholder:text-gray-design',
              'outline-none',
              'transition-all duration-200',
              'focus:border-primary-design',
              'focus:ring-2',
              'focus:ring-primary-design/20',
            ].join(' ')}
          />

          {/* Colaborador */}

          <label
            htmlFor="colaborador-fechar"
            className="mb-[-8px] text-sm font-medium text-gray-border-design"
          >
            Colaborador:
          </label>

          <select
            id="colaborador-fechar"
            value={colaboradorId}
            onChange={(e) =>
              setColaboradorId(e.target.value)
            }
            required
            className={[
              'w-full',
              'rounded-lg',
              'border border-gray-border-design/30',
              'bg-gray-bold-design/20',
              'px-3 py-2.5',
              'text-sm',
              'text-white-design',
              'outline-none',
              'transition-all duration-200',
              'focus:border-primary-design',
              'focus:ring-2',
              'focus:ring-primary-design/20',
            ].join(' ')}
          >
            {Colaboradores.map((colaborador) => (
              <option
                key={colaborador.id_colaborador}
                value={colaborador.id_colaborador}
                className="bg-black-design"
              >
                {colaborador.nome}
              </option>
            ))}
          </select>

          {/* Submit */}

          <button
            type="submit"
            className={[
              'mt-2',
              'w-full',
              'rounded-lg',
              'bg-primary-design',
              'px-4 py-3',
              'text-sm font-semibold',
              'text-black-design',
              'transition-colors duration-200',
              'hover:bg-primary-design_hover',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-primary-design/40',
              'active:scale-[0.98]',
            ].join(' ')}
          >
            Fechar cavidade
          </button>
        </form>
      </div>

      {/* ==========================================
          MODAL ABRIR CAVIDADE
      ========================================== */}

      <div
        className={[
          !modalAbrirCav
            ? 'hidden'
            : 'block',

          // Posicionamento
          'fixed left-1/2 top-1/2',
          '-translate-x-1/2 -translate-y-1/2',
          'z-[1000]',

          // Responsividade
          'w-[calc(100%-24px)]',
          'max-w-[460px]',

          // Espaçamento
          'p-5 sm:p-7 md:p-8',

          // Visual
          'rounded-xl',
          'border border-slate-200',
          'bg-black-design',
          'text-white-design',
          'shadow-xl shadow-black-design/20',
        ].join(' ')}
      >
        {/* Fechar */}

        <button
          type="button"
          onClick={fecharModal}
          aria-label="Fechar modal"
          className={[
            'absolute right-4 top-4',
            'flex h-8 w-8',
            'items-center justify-center',
            'rounded-full',
            'bg-transparent',
            'text-gray-design',
            'transition-colors duration-200',
            'hover:bg-white/10',
            'hover:text-white-design',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-primary-design/40',
          ].join(' ')}
        >
          <strong className="text-base font-medium">
            X
          </strong>
        </button>

        <form
          onSubmit={handleSubmitAbrirCav}
          className="flex flex-col gap-4"
        >
          {/* Título */}

          <h2
            className={[
              'mb-1',
              'pr-8',
              'text-[1.1rem]',
              'font-semibold',
              'leading-[1.4]',
              'sm:text-[1.2rem]',
            ].join(' ')}
          >
            Deseja abrir a cavidade{' '}
            <span className="text-red-500">
              {cavidadeSelecionada}
            </span>{' '}
            do molde{' '}
            <strong className="text-primary-design">
              {codMoldeFormatado}
            </strong>
            ?
          </h2>

          {/* Colaborador */}

          <label
            htmlFor="colaborador-abrir"
            className="mb-[-8px] text-sm font-medium text-gray-border-design"
          >
            Colaborador:
          </label>

          <select
            id="colaborador-abrir"
            value={colaboradorId}
            onChange={(e) =>
              setColaboradorId(e.target.value)
            }
            required
            className={[
              'w-full',
              'rounded-lg',
              'border border-gray-border-design/30',
              'bg-gray-bold-design/20',
              'px-3 py-2.5',
              'text-sm',
              'text-white-design',
              'outline-none',
              'transition-all duration-200',
              'focus:border-primary-design',
              'focus:ring-2',
              'focus:ring-primary-design/20',
            ].join(' ')}
          >
            {Colaboradores.map((colaborador) => (
              <option
                key={colaborador.id_colaborador}
                value={colaborador.id_colaborador}
                className="bg-black-design"
              >
                {colaborador.nome}
              </option>
            ))}
          </select>

          {/* Submit */}

          <button
            type="submit"
            className={[
              'mt-2',
              'w-full',
              'rounded-lg',
              'bg-primary-design',
              'px-4 py-3',
              'text-sm font-semibold',
              'text-black-design',
              'transition-colors duration-200',
              'hover:bg-primary-design_hover',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-primary-design/40',
              'active:scale-[0.98]',
            ].join(' ')}
          >
            Abrir cavidade
          </button>
        </form>
      </div>
    </>
  )
}
