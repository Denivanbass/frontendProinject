import { cookies } from 'next/headers'
import LoginCard from '@/components/logincard/page'
import { redirect } from 'next/navigation'





export default async function Login() {

    const cookieStore = await cookies()


    const hasToken = cookieStore.get('token')
    if (hasToken?.value) {
        return redirect('/molde')
    }   


    return (

        <LoginCard />
    )
}