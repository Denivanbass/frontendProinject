'use client'
import api from "@/service/api";
import { useActionState, useState } from "react"


type ActionState = {
    success: boolean;
    error: string;
}


async function LoginManutencao(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    const email = formData.get('email') as string;
    const senha = formData.get('password') as string;

    try {
        const response = await api.post('/login', { email, senha })
        console.log(response)
        return { success: true, error: '' }

    } catch (error) {
        return { success: false, error: 'usuario não encontrado.' }
    }


}



export default function Manutencao( ) {    

    const [state, formAction, isPending] = useActionState(LoginManutencao, null)


    return (
        <div>
            <h2>Página Manutencão</h2>
            <p>Testando UseActionState do React</p>



            <form action={formAction}>

                <label htmlFor="">email</label>
                <input type="email" name="email" />
                <br />

                <label htmlFor="">password</label>
                <input type="password" name="password" />
                <br />

                <button type="submit" disabled={isPending}>
                    {isPending ? 'Fazendo Login' : 'Entrar'}
                </button>
                
                

            </form>
        </div>
    )
}