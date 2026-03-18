'use client'
import {useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import clsx from "clsx";
import useWindowWidth from "@/app/hooks/useWindowWidth";

const files = [
    "stekte_nudler_m_biff.png",
    "biff_i_husets_spesialsaus.png",
    "biff_i_sterk_chilisaus.png"
]

function cleanName(file: string) {
    let cleanedName = file
        //"Remove all the different characters shown"
        .replace(/\.[^/.]+$/, "")
        // replace "_" with " "
        .replaceAll("_", " ");
    // Make first character upper case
    return cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
}

export default function Carousel() {
    const [dishIndex, setDishIndex] = useState(0);
    const width = useWindowWidth();

    // Set of all the dishes
    const dishData = files.map((file: string, i: number) => ({
        id: i + 1,
        name: cleanName(file),
        imageUrl: `/images/dishes/${file}`
    }));

    // If no dishes are in the system
    if (dishData.length === 0) {
        return <div></div>;
    }
    // list of all the dishes. Will only show 3 at a time.
    let visibleDishes = [
        dishData[(dishIndex - 1 + dishData.length) % dishData.length],
        dishData[dishIndex],
        dishData[(dishIndex + 1) % dishData.length]
    ];
    // only show 1 item on smaller screen sizes
    if (width < 1024){
        visibleDishes = [dishData[dishIndex]]
    }

    const handleNextDish = () => {
        setDishIndex((prevIndex) => {
            if (prevIndex === 0) return dishData.length - 1;
            return prevIndex - 1;
        });
    };

    const handlePrevDish = () => {
        setDishIndex((index) => {
            return (index + 1) % dishData.length
        });
    };

    return (
            <div className={"flex items-center justify-center lg:gap-10 md:my-5"}>
                {/* left button */}
                <ChevronLeftIcon className={"size-6 cursor-pointer"} onClick={handlePrevDish}/>
                {/* carousel content */}
                <ul className={`flex justify-center items-center md:gap-10 py-10`}>
                    {visibleDishes.map((dish, i) => {
                        return (
                            <li key={i} className={clsx(
                                "flex flex-col items-center",
                                "transition-transform duration-200 ease-in-out hover:scale-95 lg:hover:scale-105",
                                i === 1 ? "scale-100 w-95 md:w-100 lg:w-70 xl:w-90 2xl:w-110" : "scale-90 w-95 md:w-100 lg:w-55 xl:w-60 2xl:w-90",
                            )}>
                                <img src={dish.imageUrl}
                                     alt={dish.name}
                                     className={"mb-4"}
                                />
                                <p>{dish.name}</p>
                            </li>
                        )
                    })}
                </ul>
                {/* right button */}
                <ChevronRightIcon className={"size-6 cursor-pointer"} onClick={handleNextDish}/>
            </div>
    );
}