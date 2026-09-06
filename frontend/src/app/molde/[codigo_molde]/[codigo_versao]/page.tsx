import api from "@/service/api";
import style from './page.module.css';
import CardCav from "@/components/cardCavidade/cardCav";
import ExportReportButton from "@/components/exportReport/ExportReportButton";

export const revalidate = 0;

export interface CavidadeProps {
  number: number;
  status: string;
}

export interface DetalhesMoldeResponse {
  id_versao: number;
  id_molde: number;
  versao: string;
  molde: {
    id_molde: number;
    cod_molde: string;
    description: string;
  };
  cavidade: CavidadeProps[];
}

export interface FechadaProps {
  id_ocorrencia?: number;
  cavidade: { number: number };
  defeito: { descricao_defeito: string };
}

export interface ColaboradorProps {
  id_colaborador: number;
  nome: string;
  cargo: string;
}

export interface DefeitoProps {
  id_defeito: number;
  descricao_defeito: string;
}

interface MoldeVersaoProps {
  params: Promise<{
    codigo_molde: string;
    codigo_versao: string;
  }>;
}

export default async function DetalhesMolde({ params }: MoldeVersaoProps) {
  const { codigo_molde, codigo_versao } = await params;

  let moldeData: DetalhesMoldeResponse | null = null;
  let cavFechadas: FechadaProps[] = [];
  let colaboradores: ColaboradorProps[] = [];
  let defeitos: DefeitoProps[] = [];

  const [moldeRes, fechadasRes, defeitosRes, colaboradoresRes] =
    await Promise.allSettled([
      api.get<DetalhesMoldeResponse>(`/molde/${codigo_molde}/${codigo_versao}`),
      api.get<FechadaProps[]>(`/fechada/${codigo_molde}/${codigo_versao}`),
      api.get<DefeitoProps[]>('/defeitos'),
      api.get<ColaboradorProps[]>('/colaborador'),
    ]);

  if (moldeRes.status === 'fulfilled') moldeData = moldeRes.value.data;
  if (fechadasRes.status === 'fulfilled') cavFechadas = fechadasRes.value.data;
  if (defeitosRes.status === 'fulfilled') defeitos = defeitosRes.value.data;
  if (colaboradoresRes.status === 'fulfilled') colaboradores = colaboradoresRes.value.data;

  // --- CÁLCULOS DE KPI E EFICIÊNCIA ---
  const totalCavidades = moldeData?.cavidade.length || 0;
  const cavidadesAbertas = moldeData?.cavidade.filter((c) => c.status === 'Aberta').length || 0;
  const cavidadesFechadasCount = totalCavidades - cavidadesAbertas;
  const eficiencia = totalCavidades > 0 ? Math.round((cavidadesAbertas / totalCavidades) * 100) : 0;
  const perdaCapacidade = 100 - eficiencia;
  const alertaManutencao = eficiencia < 75 && totalCavidades > 0;

  // --- RESUMO DE DEFEITOS RECORRENTES (Pareto local) ---
  const defeitoContagem: Record<string, number> = {};
  cavFechadas.forEach((item) => {
    const nomeDefeito = item.defeito.descricao_defeito;
    defeitoContagem[nomeDefeito] = (defeitoContagem[nomeDefeito] || 0) + 1;
  });

  const topDefeitos = Object.entries(defeitoContagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className='bg-white-design w-full p-6'>
      <div className=' bg-white-design w-full max-w-7xl m-auto'>
        {/* CABEÇALHO COM BOTÃO DE EXPORTAÇÃO */}
        <div className='flex flex-col gap-4 mb-4'>
          <div>
            <h1 className='text-2xl text-black-design font-bold'>
              {moldeData
                ? `${moldeData.molde.cod_molde} - ${moldeData.versao}`
                : "Nenhum molde encontrado"}
            </h1>
            <p className='text-base text-gray-bold-design'>
              {moldeData?.molde.description || "Sem descrição cadastrada"}
            </p>
          </div>

        </div>

        {/* BANNER DE ALERTA SE A EFICIÊNCIA FOR MENOR QUE 75% */}
        {alertaManutencao && (
          <div className='border border-red-500 rounded-lg p-2 bg-red-500/20 mb-4'>
            <strong  >⚠️ Alerta de Ferramentaria:</strong> Molde operando com apenas{' '}
            <strong className='text-red-500'>{eficiencia}%</strong> da sua capacidade. Recomendada intervenção para manutenção preventiva.
          </div>
        )}

        {/* CARDS DE KPI */}
        <div className={`${style.kpi_grid} `}>
          <div className={style.kpi_card}>
            <span className={style.kpi_label}>Total Cavidades</span>
            <strong className={style.kpi_value}>{totalCavidades}</strong>
          </div>

          <div className={style.kpi_card}>
            <span className={style.kpi_label}>Operacionais</span>
            <strong className={`${style.kpi_value} ${style.kpi_success}`}>
              {cavidadesAbertas}
            </strong>
          </div>

          <div className={style.kpi_card}>
            <span className={style.kpi_label}>Bloqueadas</span>
            <strong className={`${style.kpi_value} ${style.kpi_danger}`}>
              {cavidadesFechadasCount}
            </strong>
          </div>

          <div className={style.kpi_card}>
            <span className={style.kpi_label}>Eficiência Atual</span>
            <strong
              className={`${style.kpi_value} ${eficiencia >= 80
                ? style.kpi_success
                : eficiencia >= 60
                  ? style.kpi_warning
                  : style.kpi_danger
                }`}
            >
              {eficiencia}%
            </strong>
          </div>

          <div className={style.kpi_card}>
            <span className={style.kpi_label}>Perda de Capacidade</span>
            <strong className={`${style.kpi_value} ${style.kpi_danger}`}>
              -{perdaCapacidade}%
            </strong>
          </div>
        </div>

        <hr className={style.divider} />

        {/* SEÇÃO PRINCIPAL */}
        <section className={style.hero_section}>
          {/* MAPA DE CAVIDADES */}
          <div className={style.hero_cav}>
            <h2 className={style.section_subtitle}>Visão Geral das Cavidades</h2>
            <ul className={style.card_grid}>
              <CardCav
                ListaCavidades={moldeData?.cavidade || []}
                Colaboradores={colaboradores}
                Defeitos={defeitos}
                codigo_molde={codigo_molde}
                codigo_versao={codigo_versao}
              />
            </ul>
          </div>

          {/* PAINEL LATERAL: HISTÓRICO E CAUSA RAIZ */}
          <div className={style.hero_hist}>
            {/* PARETO DOS PRINCIPAIS DEFEITOS */}
            {topDefeitos.length > 0 && (
              <div className={style.pareto_box}>
                <h3>Principais Motivos de Bloqueio</h3>
                <ul className={style.pareto_list}>
                  {topDefeitos.map(([defeito, qtd]) => (
                    <li key={defeito} className={style.pareto_item}>
                      <span>{defeito}</span>
                      <strong className={style.pareto_badge}>{qtd}x</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* HISTÓRICO DE OCORRÊNCIAS */}
            <div className={style.historico_box}>
              <h3>Ocorrências de Cavidades Fechadas</h3>
              {cavFechadas.length === 0 ? (
                <p className={style.empty_text}>Nenhuma cavidade fechada no momento.</p>
              ) : (
                <ul className={style.historico_cav}>
                  {cavFechadas.map((item, index) => (
                    <li
                      className={style.hist_item}
                      key={item.id_ocorrencia ?? `${item.cavidade.number}-${index}`}
                    >
                      <p>
                        <strong>Cav. {item.cavidade.number}</strong> — {item.defeito.descricao_defeito}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
        <ExportReportButton />
      </div>

    </div>
  );
}