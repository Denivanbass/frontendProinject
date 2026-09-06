"use client";

import { useState, FormEvent } from 'react';
import style from './cardCav.module.css';
import api from '@/service/api';
import { useRouter } from 'next/navigation';
import {
  CavidadeProps,
  ColaboradorProps,
  DefeitoProps,
} from '@/app/molde/[codigo_molde]/[codigo_versao]/page';

interface CardCavProps {
  ListaCavidades: CavidadeProps[];
  Colaboradores: ColaboradorProps[];
  Defeitos: DefeitoProps[];
  codigo_molde: string;
  codigo_versao: string;
}

export default function CardCav({
  ListaCavidades,
  Colaboradores,
  Defeitos,
  codigo_molde,
  codigo_versao,
}: CardCavProps) {
  const [modalFecharCav, setModalFecharCav] = useState<boolean>(false);
  const [modalAbrirCav, setModalAbrirCav] = useState<boolean>(false);
  const [cavidadeSelecionada, setCavidadeSelecionada] = useState<number | null>(null);

  // Estados dos formulários (evita conflito de refs)
  const [defeitoId, setDefeitoId] = useState<string>('');
  const [colaboradorId, setColaboradorId] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');

  const router = useRouter();

  // Garante que o código do molde seja decodificado se tiver caracteres especiais
  const codMoldeFormatado = decodeURIComponent(codigo_molde);
  const versaoFormatada = decodeURIComponent(codigo_versao);

  // Enviar formulário para FECHAR a cavidade
  async function handleSubmitFecharCav(e: FormEvent) {
    e.preventDefault();

    if (!cavidadeSelecionada) return;

    const payload = {
      num_cav: Number(cavidadeSelecionada),
      descricao: descricao,
      id_defeito: Number(defeitoId),
      cod_molde: codMoldeFormatado, // Enviando cod_molde padronizado
      codigo_molde: codMoldeFormatado, // Enviando também como fallback
      versao: versaoFormatada,
      id_colaborador: Number(colaboradorId),
    };

    try {
      await api.post('/ocorrencia/registro', payload);
      fecharModal();
      router.refresh();
    } catch (error) {
      console.error('Erro ao registrar fechamento de cavidade:', error);
    }
  }

  // Enviar formulário para ABRIR a cavidade
  async function handleSubmitAbrirCav(e: FormEvent) {
    e.preventDefault();

    if (!cavidadeSelecionada) return;

    const payload = {
      cod_molde: codMoldeFormatado,
      versao: versaoFormatada,
      number: Number(cavidadeSelecionada),
      num_cav: Number(cavidadeSelecionada),
      id_colaborador: Number(colaboradorId),
    };

    try {
      await api.put('/abrircavidade', payload);
      fecharModal();
      router.refresh();
    } catch (error) {
      console.error('Erro ao reabrir cavidade:', error);
    }
  }

  function abrirModal(item_number: number, item_status: string) {
    setCavidadeSelecionada(item_number);

    // Seleciona o primeiro item como padrão caso existam listas
    if (Defeitos.length > 0) setDefeitoId(String(Defeitos[0].id_defeito));
    if (Colaboradores.length > 0) setColaboradorId(String(Colaboradores[0].id_colaborador));

    if (item_status === 'Aberta') {
      setModalFecharCav(true);
    } else if (item_status === 'Fechada') {
      setModalAbrirCav(true);
    }
  }

  function fecharModal() {
    setModalFecharCav(false);
    setModalAbrirCav(false);
    setCavidadeSelecionada(null);
    setDescricao('');
    setDefeitoId('');
    setColaboradorId('');
  }

  return (
    <>
      {ListaCavidades.map((item) => (
        <li
          className={`  ${style.card_active}  ${item.status === 'Aberta' ? style.card_active : style.card_inactive
            }`}
          key={item.number}
          onClick={() => abrirModal(item.number, item.status)}
        >
          <p
            className={`${style.cavidade} ${item.status === 'Aberta' ? style.ativa : style.inativa
              }`}
          >
            {item.number}
          </p>
          <p
            className={`${style.status} ${item.status === 'Aberta' ? style.ativa : style.inativa
              }`}
          >
            {item.status}
          </p>
        </li>
      ))}

      {/* Modal Fechar Cavidade */}
      <div
        className={`${!modalFecharCav ? style.modalFecharcavInativo : style.modalFecharcavAtivo
          } ${style.posicionamentoModal}`}
      >
        <button type="button" onClick={fecharModal}>
          <strong>X</strong>
        </button>

        <form onSubmit={handleSubmitFecharCav}>
          <h2>
            Deseja fechar a cavidade{' '}
            <span className={style.inativa}>{cavidadeSelecionada}</span> do molde{' '}
            <strong>{codMoldeFormatado}</strong>?
          </h2>

          <label htmlFor="defeito">Selecione o defeito:</label>
          <select
            id="defeito"
            value={defeitoId}
            onChange={(e) => setDefeitoId(e.target.value)}
            required
          >
            {Defeitos.map((defeito) => (
              <option key={defeito.id_defeito} value={defeito.id_defeito}>
                {defeito.descricao_defeito}
              </option>
            ))}
          </select>

          <label htmlFor="descricao">Descrição / Observação:</label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhes adicionais (opcional)"
          />

          <label htmlFor="colaborador-fechar">Colaborador:</label>
          <select
            id="colaborador-fechar"
            value={colaboradorId}
            onChange={(e) => setColaboradorId(e.target.value)}
            required
          >
            {Colaboradores.map((colaborador) => (
              <option
                key={colaborador.id_colaborador}
                value={colaborador.id_colaborador}
              >
                {colaborador.nome}
              </option>
            ))}
          </select>

          <button type="submit">Fechar cavidade</button>
        </form>
      </div>

      {/* Modal Abrir Cavidade */}
      <div
        className={`${!modalAbrirCav ? style.modalFecharcavInativo : style.modalFecharcavAtivo
          } ${style.posicionamentoModal}`}
      >
        <button type="button" onClick={fecharModal}>
          <strong>X</strong>
        </button>

        <form onSubmit={handleSubmitAbrirCav}>
          <h2>
            Deseja abrir a cavidade{' '}
            <span className={style.inativa}>{cavidadeSelecionada}</span> do molde{' '}
            <strong>{codMoldeFormatado}</strong>?
          </h2>

          <label htmlFor="colaborador-abrir">Colaborador:</label>
          <select
            id="colaborador-abrir"
            value={colaboradorId}
            onChange={(e) => setColaboradorId(e.target.value)}
            required
          >
            {Colaboradores.map((colaborador) => (
              <option
                key={colaborador.id_colaborador}
                value={colaborador.id_colaborador}
              >
                {colaborador.nome}
              </option>
            ))}
          </select>

          <button type="submit">Abrir cavidade</button>
        </form>
      </div>
    </>
  );
}