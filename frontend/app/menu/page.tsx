import Container from "@/app/ui/Container";
import Image from "next/image";

export default function Page () {
    return (
        <section className={"relative bg-custom-eggwhite min-h-[70dvh] h-full"}>
            <Container style={"flex flex-col items-center h-full justify-center gap-10"}>
                <h1 className={"text-3xl lg:text-5xl z-10"}>Vår meny</h1>
                <a className={"default-btn z-10 lg:text-xl font-title bg-custom-red border-custom-red text-white hover:bg-custom-eggwhite hover:text-custom-red"}>Les menyen her</a>
            </Container>
            <Image src={"/drawings/noodles.png"} width={100} height={100} className={"absolute z-1 bottom-0 left-0 w-30 md:w-50 lg:w-50 2xl:w-70 opacity-70"}
                   alt={"hand drawing of asian noodles dish."}/>
            <Image src={"/drawings/chopsticks.png"} width={450} height={500} className={"absolute z-1 top-0 right-0 w-40 md:w-60 lg:w-80 2xl:w-90 opacity-70"}
                   alt={"hand drawing of asian spring rolls and dumplings."}/>
        </section>
    )
}