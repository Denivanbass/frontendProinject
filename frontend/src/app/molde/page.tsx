import { getMoldes, MoldeEncontradoProps } from '@/_actions/_getMoldes/page';
import EscolherMolde from '@/components/escolherMolde';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Moldes() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Se não houver token, redireciona para o login
  if (!token) {
    redirect('/login');
  }

  let dados: MoldeEncontradoProps[] = [];

  try {
    dados = await getMoldes(token);
  } catch (error) {
    console.error('Erro ao carregar a página de moldes:', error);
  }

  return (
    <main>
      <EscolherMolde moldesNoBanco={dados} />
    </main>
  );
}