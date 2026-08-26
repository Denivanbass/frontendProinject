import api from '@/service/api';

export interface VersaoProps {
  id_versao: number;
  id_molde: number;
  versao: string;
}

export interface MoldeEncontradoProps {
  id_molde: number;
  cod_molde: string;
  description: string;
  versao: VersaoProps[];
}

export async function getMoldes(token: string): Promise<MoldeEncontradoProps[]> {
  try {
    const { data } = await api.get<MoldeEncontradoProps[]>('/moldes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error('Erro ao buscar moldes:', error);
    return [];
  }
}