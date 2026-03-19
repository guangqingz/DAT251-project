'use client';

import Link from "next/link";
import Image from "next/image";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import Container from "@/app/ui/Container";
import {useState} from "react";
import clsx from "clsx";
import {usePathname} from "next/navigation";
import NavLink from "@/app/ui/navbar/NavLink";

export type NavLinkProps = {
    href: string,
    name: string,
    style: string,
    isButton: boolean,
}

const navLinks: NavLinkProps[] = [
    {
        href: "/menu",
        name: "meny",
        style: "py-2 text-white",
        isButton: false
    },
    {
        href: "/contact",
        name: "kontakt oss",
        style: "py-2 text-white",
        isButton: false
    },
    {
        href: "/booking",
        name: "reserver bord",
        style: "default-btn text-white border-white hover:bg-custom-eggwhite hover:border-2 hover:border-custom-eggwhite hover:text-black",
        isButton: true
    },
]

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return <header className={"relative bg-background z-20"}>
        <Container>
            <nav className={clsx("flex justify-between items-center border-custom-eggwhite px-5 md:p-0",
                {"md:border-b" : pathname === "/"})}>
                <Link href={"/"}>
                    <Image src={"/logo.png"} alt={"Logo of the restaurant"} priority width={200} height={200} className={"w-40 md:w-60 h-auto"}/>
                </Link>
                {/* Mobile menu button */}
                <button type={"button"}
                        aria-expanded={isOpen}
                        aria-controls={"navbar"}
                        aria-label={isOpen ? "close menu" : "open menu"}
                        onClick={() => setIsOpen(!isOpen)}
                        className={"group text-white md:hidden z-5"}>
                    <span className="sr-only">Åpne hovedmeny</span>
                    <Bars3Icon aria-hidden={"true"} className={"block size-8 group-aria-expanded:hidden"}/>
                    <XMarkIcon aria-hidden={"true"} className={"hidden size-8 group-aria-expanded:block"}/>
                </button>
                <ul id={"navbar"}
                    className={clsx(
                    "fixed right-0 w-full bg-custom-red pt-30 pb-15",
                    "flex flex-col items-center gap-8 uppercase font-title",
                    "transition-top duration-400 ease-in-out",
                    "md:static md:bg-background md:flex-row md:p-0 md:transition-none md:gap-10 md:justify-end",
                    isOpen ? "top-0" : "-top-full",
                )}>
                    {navLinks.map((link, index) =>
                        <li key={index}>
                            <NavLink navLink={link} pathname={pathname}/>
                        </li>
                    )}
                </ul>
            </nav>
        </Container>
    </header>
}