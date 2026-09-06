import api from "@/service/api";
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
  cavidade: {
    number: number;
  };
  defeito: {
    descricao_defeito: string;
  };
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

export default async function DetalhesMolde({
  params,
}: MoldeVersaoProps) {
  const { codigo_molde, codigo_versao } = await params;

  let moldeData: DetalhesMoldeResponse | null = null;
  let cavFechadas: FechadaProps[] = [];
  let colaboradores: ColaboradorProps[] = [];
  let defeitos: DefeitoProps[] = [];

  const [
    moldeRes,
    fechadasRes,
    defeitosRes,
    colaboradoresRes,
  ] = await Promise.allSettled([
    api.get<DetalhesMoldeResponse>(
      `/molde/${codigo_molde}/${codigo_versao}`
    ),
    api.get<FechadaProps[]>(
      `/fechada/${codigo_molde}/${codigo_versao}`
    ),
    api.get<DefeitoProps[]>("/defeitos"),
    api.get<ColaboradorProps[]>("/colaborador"),
  ]);

  if (moldeRes.status === "fulfilled") {
    moldeData = moldeRes.value.data;
  }

  if (fechadasRes.status === "fulfilled") {
    cavFechadas = fechadasRes.value.data;
  }

  if (defeitosRes.status === "fulfilled") {
    defeitos = defeitosRes.value.data;
  }

  if (colaboradoresRes.status === "fulfilled") {
    colaboradores = colaboradoresRes.value.data;
  }

  // ==========================================
  // KPIs
  // ==========================================

  const totalCavidades = moldeData?.cavidade.length ?? 0;

  const cavidadesAbertas =
    moldeData?.cavidade.filter(
      (cavidade) => cavidade.status === "Aberta"
    ).length ?? 0;

  const cavidadesFechadasCount =
    totalCavidades - cavidadesAbertas;

  const eficiencia =
    totalCavidades > 0
      ? Math.round(
          (cavidadesAbertas / totalCavidades) * 100
        )
      : 0;

  const perdaCapacidade = 100 - eficiencia;

  const alertaManutencao =
    totalCavidades > 0 && eficiencia < 75;

  // ==========================================
  // PARETO
  // ==========================================

  const defeitoContagem: Record<string, number> = {};

  cavFechadas.forEach((item) => {
    const defeito = item.defeito.descricao_defeito;

    defeitoContagem[defeito] =
      (defeitoContagem[defeito] ?? 0) + 1;
  });

  const topDefeitos = Object.entries(defeitoContagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // ==========================================
  // DADOS DOS KPIs
  // ==========================================

  const kpis = [
    {
      label: "Total Cavidades",
      value: totalCavidades,
      color: "text-black-design",
    },
    {
      label: "Operacionais",
      value: cavidadesAbertas,
      color: "text-green-600",
    },
    {
      label: "Bloqueadas",
      value: cavidadesFechadasCount,
      color: "text-red-500",
    },
    {
      label: "Eficiência",
      value: `${eficiencia}%`,
      color:
        eficiencia >= 80
          ? "text-green-600"
          : eficiencia >= 60
            ? "text-yellow-500"
            : "text-red-500",
    },
    {
      label: "Perda de Capacidade",
      value: `-${perdaCapacidade}%`,
      color: "text-red-500",
      fullMobile: true,
    },
  ];

  return (
    <main className="min-h-screen w-full bg-white-design px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
      <div className="mx-auto w-full max-w-7xl">

        {/* ==========================================
            CABEÇALHO
        ========================================== */}

        <header className="mb-3 sm:mb-4">
          <h1 className="text-lg font-bold text-black-design sm:text-xl md:text-2xl">
            {moldeData
              ? `${moldeData.molde.cod_molde} - ${moldeData.versao}`
              : "Nenhum molde encontrado"}
          </h1>

          <p className="mt-0.5 text-xs text-gray-bold-design sm:text-sm md:text-base">
            {moldeData?.molde.description ||
              "Sem descrição cadastrada"}
          </p>
        </header>

        {/* ==========================================
            ALERTA
        ========================================== */}

        {alertaManutencao && (
          <div className="mb-3 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-black-design sm:mb-4 sm:p-3 sm:text-sm">
            <strong>⚠️ Alerta de Ferramentaria:</strong>{" "}
            Molde operando com apenas{" "}
            <strong className="text-red-500">
              {eficiencia}%
            </strong>{" "}
            da sua capacidade. Recomendada intervenção para
            manutenção preventiva.
          </div>
        )}

        {/* ==========================================
            KPIs
        ========================================== */}

        <section className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`flex min-h-[78px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:min-h-[85px] sm:p-3.5 md:min-h-[90px] ${
                kpi.fullMobile ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <span className="text-[11px] font-medium text-gray-bold-design sm:text-xs">
                {kpi.label}
              </span>

              <strong
                className={`text-xl font-bold sm:text-2xl ${kpi.color}`}
              >
                {kpi.value}
              </strong>
            </div>
          ))}
        </section>

        {/* ==========================================
            DIVISOR
        ========================================== */}

        <div className="my-4 h-px w-full bg-slate-200 md:my-5" />

        {/* ==========================================
            CONTEÚDO PRINCIPAL

            MOBILE:
            1 coluna

            TABLET:
            matriz ocupa 100% da largura

            DESKTOP:
            matriz + informações laterais
        ========================================== */}

        <section className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2 lg:grid-rows-3">

          {/* ========================================
              MATRIZ DE CAVIDADES
          ======================================== */}

          <div className="min-w-0 lg:row-span-3">
            <div className="flex min-h-[420px] flex-col gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3 shadow-sm sm:min-h-[480px] sm:p-4 md:min-h-[560px] lg:h-full lg:min-h-[650px]">

              {/* Cabeçalho da matriz */}

              <div className="flex shrink-0 items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-black-design sm:text-base md:text-lg">
                    Visão Geral das Cavidades
                  </h2>

                  <p className="text-[11px] text-gray-bold-design sm:text-xs">
                    Status atual do molde
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-gray-bold-design shadow-sm sm:px-2.5 sm:text-xs">
                  {totalCavidades} cavidades
                </span>
              </div>

              {/* Área da matriz */}

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-lg bg-white/50 p-2 sm:p-3">
                <ul className="grid w-full grid-cols-4 content-start gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8">
                  <CardCav
                    ListaCavidades={moldeData?.cavidade || []}
                    Colaboradores={colaboradores}
                    Defeitos={defeitos}
                    codigo_molde={codigo_molde}
                    codigo_versao={codigo_versao}
                  />
                </ul>
              </div>
            </div>
          </div>

          {/* ========================================
              HISTÓRICO
          ======================================== */}

          <div className="min-w-0">
            <div className="flex min-h-[180px] flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:h-full lg:min-h-0">

              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black-design sm:text-base">
                  Ocorrências
                </h3>

                {cavFechadas.length > 0 && (
                  <span className="rounded-full px-2 py-0.5 text-4 font-semibold text-red-600">
                    {cavFechadas.length}
                  </span>
                )}
              </div>

              {cavFechadas.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-center text-xs text-gray-bold-design sm:text-sm">
                    Nenhuma cavidade fechada no momento.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1.5 overflow-y-auto">
                  {cavFechadas.map((item, index) => (
                    <li
                      key={
                        item.id_ocorrencia ??
                        `${item.cavidade.number}-${index}`
                      }
                      className="rounded-md bg-slate-200 px-2.5 py-1.5 text-xs sm:text-sm"
                    >
                      <p className="text-black-design">
                        <strong>
                          Cav. {item.cavidade.number}
                        </strong>{" "}
                        —{" "}
                        <span className="text-gray-bold-design">
                          {item.defeito.descricao_defeito}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ========================================
              PARETO
          ======================================== */}

          <div className="min-w-0">
            <div className="flex min-h-[150px] flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:h-full">

              <h3 className="mb-2 text-sm font-semibold text-black-design sm:text-base">
                Principais Motivos de Bloqueio
              </h3>

              {topDefeitos.length === 0 ? (
                <div className="flex flex-1 items-center">
                  <p className="text-xs text-gray-bold-design sm:text-sm">
                    Nenhum defeito registrado.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {topDefeitos.map(([defeito, qtd]) => (
                    <li
                      key={defeito}
                      className="flex items-center justify-between gap-2 rounded-md bg-slate-200 px-2.5 py-1.5"
                    >
                      <span
                        className="min-w-0 truncate text-xs text-gray-bold-design sm:text-sm"
                        title={defeito}
                      >
                        {defeito}
                      </span>

                      <strong className="shrink-0 rounded-full  px-2 py-0.5 text-4 font-semibold text-red-600 sm:text-4">
                        {qtd}x
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ========================================
              EXPORTAÇÃO
          ======================================== */}

            <div className="w-full ">
              <ExportReportButton />
            </div>
          
        </section>
      </div>
    </main>
  );
}
