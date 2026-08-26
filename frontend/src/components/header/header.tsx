

import HeaderComponent from './_header_component/page'
import { cookies } from 'next/headers'




export default async function Header() {
    const cookieStore = await cookies();

    const hasToken = cookieStore.get('token')
    const token = hasToken?.value ?? ''



    return (
        <>
            <HeaderComponent token={token} />

        </>
    )
}