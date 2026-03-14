export default function Page () {
    return (
        <main>
            <section className={"flex flex-col justify-center items-center w-full m-auto my-15 mt-20 gap-4"}>
                <h1 className={" text-white text-6xl font-bold"}> Kontakt oss </h1>
                <p className={"text-white text-xl"}>For henvendelser til restauranten ring{" "} <a href={"tel:+47-553-136-90"}>
                    +47 553 13 690
                </a></p>
            </section>
            <div className={"flex flex-col justify-center items-center w-full m-auto gap-3"}>
                <h2 className={"text-white text-4xl"}>Åpningstider</h2>
                <ul className={"text-white text-xl text-center"}>
                    <li>Mandag: Stengt</li>
                    <li>Tirsdag: 13:30 - 21:30</li>
                    <li>Onsdag: 13:30 - 21:30</li>
                    <li>Torsdag: 13:30 - 21:30</li>
                    <li>Fredag: 13:30 - 21:30</li>
                    <li>Lørdag: 13:30 - 21:30</li>
                    <li>Søndag: 13:30 - 21:30</li>
                </ul>

                <p className={"text-white my-10 gap-2"}> <span className={"font-bold"}>Merknad: </span> Åpningstider kan avvike grunnet ferie, sjekk <a href={"https://www.facebook.com/szechuanhousebergen/"} className={"font-bold"}> Facebook siden </a> vår for de nyeste oppdateringene</p>
            </div>
        </main>

    )
}