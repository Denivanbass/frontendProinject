import style from './not-found.module.css'


export default function Error() {
    return (
        <div className={style.error}>
            <h1 className={style.error_404}>404</h1>
            <p>Página não encontrada</p>
        </div>
    )
}