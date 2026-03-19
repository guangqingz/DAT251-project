import Image from "next/image";
import Link from "next/link";
import Carousel from "./ui/Carousel";
import Container from "./ui/Container";

export default function Home() {
    return (
        <>
            <Container style={"grid grid-cols-1 md:grid-cols-2 md:py-25"}>
                <section className={"flex flex-col items-center md:items-start w-full my-20 md:my-10 gap-5"}>
                    <h1 className={"text-white text-3xl font-bold text-wrap text-center px-5 sm:px-0 sm:text-left"}>Velkommen til Sze Chuan House</h1>
                    <div className={"flex gap-2"}>
                        <Link href="/booking"
                              className={"default-btn bg-custom-gold border-custom-gold hover:bg-background hover:text-custom-gold"}>Reserver bord</Link>
                        <Link href="/menu"
                              className={"default-btn border-custom-gold text-custom-gold hover:bg-custom-gold hover:text-black"}>Se meny</Link>
                    </div>
                </section>
                <div className={"w-full h-96 overflow-hidden flex justify-center"}>
                    <Image src={"/hero.jpg"} width={800} height={600}
                           priority
                           className={"object-cover md:rounded-2xl"}
                           alt={"Image of a several dishes from the restaurant."}/>
                </div>
            </Container>
            <section className={"bg-custom-eggwhite py-10"}>
                <Container>
                    <h2 className={"flex justify-center items-center gap-3 text-2xl uppercase"}>
                        <span className={"inline-block w-8 h-0.5 bg-black"}></span>
                        Galleri
                        <span className={"inline-block w-8 h-0.5 bg-black"}></span>
                    </h2>
                    <Carousel/>
                </Container>
            </section>
        </>
    );
}
