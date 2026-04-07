import clsx from "clsx";
import Link from "next/link";
import {NavLinkProps} from "@/app/ui/navbar/Navbar";

/**
 * Reusable navbar link
 * @param navLink - given link
 * @param pathname - current path name on the page
 * @param handleClick - function to handle user interaction
 * @constructor
 */
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