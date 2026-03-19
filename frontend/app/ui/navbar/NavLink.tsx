import clsx from "clsx";
import Link from "next/link";
import {NavLinkProps} from "@/app/ui/navbar/Navbar";

export default function NavLink({navLink, pathname, handleClick}: {navLink: NavLinkProps, pathname: string, handleClick: () => void}){
    return (
        <Link href={navLink.href}
              onClick={handleClick}
              className={clsx(navLink.style,
                    {"font-bold": pathname === navLink.href && !navLink.isButton},
                    {"btn": pathname !== navLink.href && !navLink.isButton})}
              aria-current={pathname === navLink.href ? "true" : "false"}>{navLink.name}</Link>
    )
}