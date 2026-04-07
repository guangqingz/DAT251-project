import Container from "@/app/ui/Container";
import Image from "next/image";

export default function Page () {
    return (
        <section className={"relative bg-custom-eggwhite min-h-[70dvh] h-full"}>
            <Container style={"flex flex-col items-center h-full justify-center gap-10"}>
                <h1 className={"text-4xl lg:text-5xl z-10"}>Vår meny</h1>
                <div className={"flex flex-col gap-5 text-center lg:text-xl font-title z-10"}>
                    <a href={"/menu/menu-NO-2025.pdf"}
                       aria-label={"See restaurant menu in Norwegian"}
                       className={"default-btn bg-custom-red border-custom-red text-white hover:bg-custom-eggwhite hover:text-custom-red"}>Meny</a>
                    <a href={"/menu/takeaway-2025.pdf"}
                       aria-label={"See restaurant takeaway menu in Norwegian"}
                       className={"default-btn bg-custom-red border-custom-red text-white hover:bg-custom-eggwhite hover:text-custom-red"}>Takeaway</a>
                </div>
            </Container>
            {/*Decorative background illustrations*/}
            <Image src={"/drawings/noodles.png"} width={200} height={300}
                   className={"absolute z-1 opacity-70 bottom-0 left-0 w-40 md:w-50 lg:w-50 2xl:w-70 h-auto"}
                   alt={"hand drawing of asian noodles dish."}/>
            <Image src={"/drawings/chopsticks.png"} width={450} height={500}
                   className={"absolute z-1 opacity-70 top-0 right-0 w-40 md:w-60 lg:w-80 2xl:w-90 h-auto"}
                   alt={"hand drawing of asian spring rolls and dumplings."}/>
        </section>
    )
}