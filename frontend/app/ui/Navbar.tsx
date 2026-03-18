'use client';

import Link from "next/link";
import Image from "next/image";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import Container from "@/app/ui/Container";
import {useState} from "react";
import clsx from "clsx";

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    return <Container>
        <nav className={"relative z-100 flex justify-between items-center md:border-b-1 border-custom-eggwhite px-5 md:p-0"}>
            <Link href={"/"}>
                <Image src={"/logo.png"} alt={"Logo of the restaurant"} width={200} height={200}/>
            </Link>
            {/* Mobile menu button */}
            <button type={"button"} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}
                    className={"group text-white md:hidden"}>
                <span className="sr-only">Åpne hovedmeny</span>
                <Bars3Icon aria-hidden={"true"} className={"block size-8 group-aria-expanded:hidden"}/>
                <XMarkIcon aria-hidden={"true"} className={"hidden size-8 group-aria-expanded:block"}/>
            </button>
            <ul className={clsx(
                "absolute top-full w-full right-0 z-1",
                "flex flex-col items-end gap-8 uppercase font-title pt-5 pb-10 bg-background",
                "transition-all md:transition-none duration-200 ease-in-out",
                "md:static md:flex-row md:w-auto md:gap-10 md:p-0 md:translate-0",
                isOpen ? "translate-x-0 pr-5" : "-translate-x-full",
            )}>
                <li><Link href="/menu" className={"btn py-2 text-white"}>Meny</Link></li>
                <li><Link href="/contact" className={"btn py-2 text-white"}>Kontakt oss</Link></li>
                <li><Link href="/booking" className={"default-btn text-white border-white hover:bg-custom-eggwhite hover:border-2 hover:border-custom-eggwhite hover:text-black"}>Reserver bord</Link></li>
            </ul>
        </nav>
    </Container>
}