import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
        <main>
          <section className={"flex flex-col justify-center items-center w-full m-auto my-10 gap-2"}>
            <h1 className={"text-white text-6xl font-bold"}>Sze Chuan House</h1>
            <p className={"text-white text-xl"}>Nedre Korskirkeallmenningen 9, 5017 Bergen</p>
            <div className={"flex gap-2"}>
                <Link href="/booking" className={"p-2 text-white rounded-md px-3 border-2 border-white hover:bg-custom-red hover:border-2 hover:border-black"}>Menu</Link>
                <Link href="/booking" className={"p-2 text-white rounded-md px-3 border-2 border-white hover:bg-custom-red hover:border-2 hover:border-black"}>Book now</Link>
            </div>
          </section>
            <div className={"w-full h-96 overflow-hidden flex justify-center"}>
                <Image src={"/hero.webp"} width={800} height={600} style={{objectFit: "cover"}} alt={"Image of a dish from the restaurant. Deepfried aubergine with special salt."}/>
            </div>
        </main>
      </>
  );
}
