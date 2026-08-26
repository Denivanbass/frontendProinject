'use client'

import Link from 'next/link'
import style from './gestao.module.css'

export default function GestaoPage() {
  const modulos = [
    {
      titulo: 'Gestão de Moldes',
      descricao: 'Cadastre novos moldes, versões e especifique a quantidade de cavidades.',
      linkPrincipal: '/molde',
      labelPrincipal: 'Ver Moldes',
      linkNovo: '/cadastro_molde',
      labelNovo: '+ Novo Molde',
    },
    {
      titulo: 'Colaboradores',
      descricao: 'Gerencie os operadores, inspetores de qualidade e turnos de trabalho.',
      linkPrincipal: '/colaboradores',
      labelPrincipal: 'Listar Todos',
      linkNovo: '/cadastro_colaborador',
      labelNovo: '+ Cadastrar Operador',
    },
    {
      titulo: 'Catálogo de Defeitos',
      descricao: 'Cadastre e categorize falhas (rebarbas, chupagem, marcas de queima).',
      linkPrincipal: '/defeitos',
      labelPrincipal: 'Ver Defeitos',
      linkNovo: '/cadastro_defeito',
      labelNovo: '+ Novo Defeito',
    },
    {
      titulo: 'Chão de Fábrica / Operação',
      descricao: 'Acesse diretamente a matriz de cavidades para registros de inspeção.',
      linkPrincipal: '/molde',
      labelPrincipal: 'Iniciar Inspeção',
    },
  ]

  return (
    <main className={style.container}>
      <header className={style.header}>
        <h1>Gestão e Operação</h1>
        <p>Selecione um dos módulos abaixo para gerenciar os dados do sistema.</p>
      </header>

      <section className={style.grid}>
        {modulos.map((item, index) => (
          <div key={index} className={style.card}>
            <div className={style.card_content}>
              <h2>{item.titulo}</h2>
              <p>{item.descricao}</p>
            </div>

            <div className={style.card_actions}>
              <Link href={item.linkPrincipal} className={style.btn_secondary}>
                {item.labelPrincipal}
              </Link>
              {item.linkNovo && (
                <Link href={item.linkNovo} className={style.btn_primary}>
                  {item.labelNovo}
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}