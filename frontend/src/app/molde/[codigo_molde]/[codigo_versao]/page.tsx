import api from "@/service/api"
import style from './page.module.css'
import CardCav from "@/components/cardCavidade/cardCav";


export const revalidate = 0;



interface CavidadeProps {
    number: number;
    status: string;
    molde: { cod_molde: string };
    versao: { versao: string };
}

interface FechadaProps {    
    cavidade: { number: number }
    defeito: { descricao_defeito: string }
}

interface colaboradoresProps {
    id_colaborador: number;
    nome: string;
    cargo: string;
}

interface DefeitosProps {
    id_defeito: number;
    descricao_defeito: string;
}

interface MoldeVersaoProps{
    params: Promise<{
        codigo_molde: string;
        codigo_versao: string;
    }>
}


// 1. Transformamos o componente em uma função assíncrona
export default async function DetalhesMolde({params}: MoldeVersaoProps) {

    const { codigo_molde, codigo_versao } = await params
   


    // 2. Buscamos os dados diretamente (sem useEffect)
    let molde: CavidadeProps[] = [];
    let cavFechadas: FechadaProps[] = []
    let colaboradoress: colaboradoresProps[] = []
    let defeitos: DefeitosProps[] = []

    try {
        const response = await api.get(`/molde/${codigo_molde}/${codigo_versao}`);
        molde = response.data;
    } catch (error) {
        console.error("Erro ao buscar dados no servidor:", error);

    }


    // Buscar historico de cavidades fechadas
    try {
        const response2 = await api.get(`/fechada/${codigo_molde}/${codigo_versao}`, {           
        });
        cavFechadas = response2.data;
    } catch (error) {
        console.error("Erro ao buscar dados no servidor:", error);
    }

    // Buscar Tipos de defeitos:
    try {
        const defeito = await api.get('/defeitos')
        defeitos = defeito.data

    } catch (error) {
        console.log(`Defeito não encontrado`)
    }



    //Buscar colaboradores:
    try {
        const colaborador = await api.get('/colaborador')
        colaboradoress = colaborador.data

    } catch (error) {
        console.log(`Colaborador não encontrado.`)
    }






    return (
        <>

            <h1 className={style.title}>
                {molde[0]?.molde?.cod_molde || "Nenhum molde encontrado"} {molde[0]?.versao?.versao}
            </h1>


            <br />
            <hr />

            <section className={style.hero_section}>
                <div className={style.hero_cav}>

                    <ul className={style.card_grid}>

                        <CardCav ListaCavidades={molde} Colaboradores={colaboradoress} Defeitos={defeitos} />

                    </ul>



                </div>
                <div className={style.hero_hist}>

                    <ul className={style.historico_cav}>
                        <h3>Cavidades Fechadas</h3>
                        {cavFechadas.map((item) => (
                            <li className={style.hist_item} key={item.cavidade.number} >
                                <p>{item.cavidade.number} - {item.defeito.descricao_defeito}</p>

                            </li>
                        ))}
                    </ul>



                </div>

            </section>

        </>
    );
}