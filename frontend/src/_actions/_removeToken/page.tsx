'use server'

import { cookies } from "next/headers";


export async function RemoveToken(){
    const cookieStore = await cookies();

    cookieStore.delete('token')
    return
}