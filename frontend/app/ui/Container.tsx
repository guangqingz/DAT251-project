export default function Container({children, style = ""} :
    { children: React.ReactNode; style?: string;}){
    return <section className={`max-w-372 w-full mx-auto md:px-10 ${style}`}>
        {children}
    </section>
}