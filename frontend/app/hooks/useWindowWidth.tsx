import {useEffect, useState} from "react";

export default function useWindowWidth(): number {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        setWidth(window.innerWidth);

        const handleResize = () => {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    },[]);

    return width;
}