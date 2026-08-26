'use server'
import api from '@/service/api'
import { cookies } from 'next/headers'


// Action minimalista: pega os dados e faz a chamada à API
export async function LoginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get('email')
  const senha = formData.get('password')


  try {
    const usuario = await api.post('/login', { email, senha })

    // 2. ✨ SALVA O TOKEN NOS COOKIES DIRETO NO SERVIDO
    const cookieStore = await cookies()
    cookieStore.set('token', usuario.data.token, {
      path: '/',
      httpOnly: true, // Segurança contra acesso JS no client
      maxAge: 60 * 60 * 8, // Duração de 8 horas
    })


    return { success: true, error: '', token: usuario.data.token }


  } catch (error) {

    return { success: false, error: true }
  }




}

