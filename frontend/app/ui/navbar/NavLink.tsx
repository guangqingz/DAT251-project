import clsx from "clsx";
import Link from "next/link";
import {NavLinkProps} from "@/app/ui/navbar/Navbar";

export default function NavLink({navLink, pathname}: {navLink: NavLinkProps, pathname: string}){
    return (
        <Link href={navLink.href} className={clsx(navLink.style,
                    {"font-bold": pathname === navLink.href && !navLink.isButton},
                    {"btn": pathname !== navLink.href && !navLink.isButton})}
              aria-current={pathname === navLink.href ? "true" : "false"}>{navLink.name}</Link>
    )
}