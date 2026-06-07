export const dynamic = 'force-dynamic';
import api from '@/service/api'
import EscolherMolde from '@/components/escolherMolde';

interface MoldesEncontradosProps {
    id_cavidade: number;
    molde: {
        id_molde: number;
        cod_molde: string;
    },
    versao: {
        id_versao: number;
        versao: string
    }
}

export default async function Moldes() {
    let moldesEncontrados: MoldesEncontradosProps[] = []

    try {
        const moldes = await api.get('/moldes')
        moldesEncontrados = moldes.data
    } catch (error) {
        throw new Error('Nenhum molde encontrado.')
    }


    return (
        <>
            <EscolherMolde moldesNoBanco={moldesEncontrados} />
        </>
    )
}