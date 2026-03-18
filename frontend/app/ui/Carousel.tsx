'use client'
import {useState} from "react";

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
    // Set of all the dishes
    const dishData = files.map((file, i) => ({
        id: i + 1,
        name: cleanName(file),
        imageUrl: `/images/dishes/${file}`
    }));
    const [dishIndex, setDishIndex] = useState(0);
    // If no dishes are in the system
    if (dishData.length === 0) {
        return <div></div>;
    }
    // list of all the dishes. Will only show 3 at a time.
    const visibleDishes = [
        dishData[(dishIndex - 1 + dishData.length) % dishData.length],
        dishData[dishIndex],
        dishData[(dishIndex + 1) % dishData.length]
    ];

    const handlePrevDish = () => {
        setDishIndex((prevIndex) => {
            if (prevIndex === 0) return dishData.length - 1;
            return prevIndex - 1;
        });
    };

    const handleNextDish = () => {
        setDishIndex((index) => {
            return (index + 1) % dishData.length
        });
    };


    return (
        <div className={"my-10 flex items-center justify-center overflow-hidden gap-30"}>
            {/* left button */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                 className="size-6 cursor-pointer"
                 onClick={handlePrevDish}>
                <path fillRule="evenodd"
                      d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                      clipRule="evenodd"/>
            </svg>
            {/* carousel content */}
            <ul className={`flex gap-20 flex-wrap h-80 justify-center`}>
                {visibleDishes.map((dish, i) => {
                    return (
                        <li key={i} className="flex flex-col items-center">
                            <img src={dish.imageUrl}
                                 alt={dish.name}
                                 className={`transition-transform duration-500 ease-in-out hover:scale-110 mb-4
                            ${i === 1 ? `w-64 h-64 ease-in-out hover:scale-110 mb-4`
                                     : `w-36 h-36 scale-100`}`}
                            />
                            <p>{dish.name}</p>
                        </li>
                    )
                })}
            </ul>
            {/* right button */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 className="size-6 cursor-pointer"
                 onClick={handleNextDish}>
                <path fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clipRule="evenodd"/>
            </svg>
        </div>
    );
}