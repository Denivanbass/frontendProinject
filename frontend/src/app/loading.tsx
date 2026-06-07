import style from './loading.module.css'
import Image from 'next/image'
import logo from '../../public/icon.png'



export default function Loading() {

    return (
        <div className={style.loading} >
            <Image
                className={''}
                src={logo}
                alt="Logo Proinject"
                width={200}
                height={200}
            />
            <h2>Carrengado...</h2>
        </div>
    )
}