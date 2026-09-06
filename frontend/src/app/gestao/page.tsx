'use client'

import Link from 'next/link'

export default function GestaoPage() {
  const modulos = [
    {
      titulo: 'Gestão de Moldes',
      descricao:
        'Cadastre novos moldes, versões e especifique a quantidade de cavidades.',
      linkPrincipal: '/molde',
      labelPrincipal: 'Ver Moldes',
      linkNovo: '/cadastro_molde',
      labelNovo: '+ Molde',
    },
    {
      titulo: 'Colaboradores',
      descricao:
        'Gerencie os operadores, inspetores de qualidade e turnos de trabalho.',
      linkPrincipal: '/colaboradores',
      labelPrincipal: 'Listar Todos',
      linkNovo: '/cadastro_colaborador',
      labelNovo: '+ Colaborador',
    },
    {
      titulo: 'Catálogo de Defeitos',
      descricao:
        'Cadastre e categorize falhas (rebarbas, chupagem, marcas de queima).',
      linkPrincipal: '/defeitos',
      labelPrincipal: 'Ver Defeitos',
      linkNovo: '/cadastro_defeito',
      labelNovo: '+ Defeito',
    },
    {
      titulo: 'Chão de Fábrica / Operação',
      descricao:
        'Acesse diretamente a matriz de cavidades para registros de inspeção.',
      linkPrincipal: '/molde',
      labelPrincipal: 'Iniciar Inspeção',
    },
  ]

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-140px)] w-full max-w-[1200px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-black-design sm:text-3xl">
          Gestão e Operação
        </h1>

        <p className="text-sm leading-relaxed text-gray-design sm:text-base">
          Selecione um dos módulos abaixo para gerenciar os dados do sistema.
        </p>
      </header>

      {/* Módulos */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        {modulos.map((item, index) => (
          <article
            key={index}
            className="group flex flex-col justify-between gap-6 rounded-2xl border border-gray-border-design/20 bg-black-design p-5 shadow-lg shadow-black-design/20 transition-all duration-300  hover:border-primary-design/40 sm:p-6"
          >
            {/* Conteúdo */}
            <div>
              <h2 className="mb-2 text-lg font-semibold text-white-design sm:text-xl">
                {item.titulo}
              </h2>

              <p className="text-sm leading-relaxed text-gray-design">
                {item.descricao}
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={item.linkPrincipal}
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-gray-border-design/30 bg-gray-bold-design/30 px-4 py-2.5 text-sm font-medium text-white-design transition-all duration-200 hover:border-gray-border-design/50 hover:bg-gray-bold-design/50 focus:outline-none focus:ring-2 focus:ring-primary-design/50"
              >
                {item.labelPrincipal}
              </Link>

              {item.linkNovo && (
                <Link
                  href={item.linkNovo}
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-primary-design px-4 py-2.5 text-sm font-semibold text-black-design transition-all duration-200 hover:bg-primary-design_hover focus:outline-none focus:ring-2 focus:ring-primary-design/50"
                >
                  {item.labelNovo}
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
