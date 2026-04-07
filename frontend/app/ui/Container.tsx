/**
 * Reusable container to give similar layout across components
 * @param children - child component to apply layout
 * @param style - additional css styles for a particular component
 * @constructor
 */
export default function Container({children, style = ""} :
    { children: React.ReactNode; style?: string;}){
    return <section className={`max-w-372 w-full mx-auto md:px-10 ${style}`}>
        {children}
    </section>
}