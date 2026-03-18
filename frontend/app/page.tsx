import Image from "next/image";
import Link from "next/link";
import Carousel from "./ui/Carousel";
import Container from "./ui/Container";

export default function Home() {
    return (
        <>
            <Container style={"grid grid-cols-2 py-20"}>
                <section className={"flex flex-col w-full my-10 gap-5"}>
                    <h1 className={"text-white text-3xl font-bold"}>Velkommen til Sze Chuan House</h1>
                    <div className={"flex gap-2"}>
                        <Link href="/menu"
                              className={"default-btn bg-custom-gold border-custom-gold hover:bg-background hover:text-custom-gold"}>Reserver bord</Link>
                        <Link href="/booking"
                              className={"default-btn border-custom-gold text-custom-gold hover:bg-custom-gold hover:text-black"}>Se meny</Link>
                    </div>
                </section>
                <div className={"w-full h-96 overflow-hidden flex justify-center"}>
                    <Image src={"/hero.jpg"} width={800} height={600} className={"object-cover rounded-2xl"}
                           alt={"Image of a dish from the restaurant. Deepfried aubergine with special salt."}/>
                </div>
            </Container>
            <section>
                    <p className={"flex justify-center my-10"}>Galleri</p>
                    <Carousel/>
            </section>
        </>
    );
}
