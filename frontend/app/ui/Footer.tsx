import Container from "@/app/ui/Container";
import {PhoneArrowDownLeftIcon} from "@heroicons/react/24/outline";

/**
 * Footer for the customer page, is not included on staff pages
 */
export default function Footer(){
    return (
        <footer className={"bg-custom-red text-white z-20"}>
            <Container style={"flex flex-col py-8 gap-10 items-center md:flex-row md:justify-between text-center md:text-left"}>
                <section>
                    <p className={"text-lg mb-3 uppercase font-bold font-title"}>åpningstider</p>
                    <ul className={"flex flex-col gap-2"}>
                        <li>Tirsdag - søndag: 13:30 - 21:30</li>
                        <li>Mandag: stengt</li>
                    </ul>
                </section>
                <section>
                    <p className={"text-lg mb-3 uppercase font-bold font-title"}>Adresse</p>
                    <address className={"not-italic flex flex-col gap-2"}>
                        <a href={"https://maps.app.goo.gl/RTmRGc1UnXhyFcev5"} className={"underline"}>Nedre Korskirkeallmenningen 9</a>
                        <p>5017 Bergen, Norge</p>
                    </address>
                </section>
                <section>
                    <p className={"text-lg mb-3 uppercase font-bold font-title"}>Kontakt</p>
                    <address className={"not-italic flex flex-col gap-2"}>
                        <a href={"tel:+47-553-136-90"} className={"flex gap-2 underline items-center"}>
                            <PhoneArrowDownLeftIcon className={"h-4.5 w-4.5"}/>
                            <p>+47 553 136 90</p>
                        </a>
                        <a href={"https://www.facebook.com/szechuanhousebergen/"} className={"underline"}>Facebook</a>
                    </address>
                </section>
            </Container>
        </footer>
    )
}