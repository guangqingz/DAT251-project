import clsx from "clsx";
import React from "react";

const days: string[] = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"]

export default function FormCalendarDays({date, chosenFullDate, handleSelectDate}:{
    date: Date, chosenFullDate: string, handleSelectDate:(value: number) => void
}){
    // used to decide the days in the calendar
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let gridSpace = (firstDayOfMonth + 6) % 7; // used to place the date numbers under correct day
    const dateInMonth: number[] = Array.from({length: lastDateOfMonth}, (_, index) => index + 1);

    const todaysDate = new Date();

    function getStateOfDay(dateItem: number):boolean[] {
        let selectedDay: boolean = false;
        let validDay: boolean = true;

        if (chosenFullDate !== undefined) {
            let chosenDate: string[] = chosenFullDate.split("-")
            let chosenYear: number = Number(chosenDate[0]);
            let chosenMonth: number = Number(chosenDate[1])
            let chosenDay: number = Number(chosenDate[2]);

            if (chosenYear === date.getFullYear() && (chosenMonth - 1) === date.getMonth() && chosenDay === dateItem) {
                selectedDay = true;
            }
        }

        if (dateItem < todaysDate.getDate() && date.getMonth() === todaysDate.getMonth()) {
            validDay = false;
        }

        return [selectedDay, validDay];
    }
    return (
        <div className={"grid grid-cols-7 mt-5 text-center gap-5"}>
            {days.map((day: string) =>
                <h4 key={day} className={"text-xl"}>{day}</h4>
            )}
            {Array.from({length: gridSpace}).map((_, i) => (
                <div key={i}></div>
            ))}
            {dateInMonth.map((dateItem: number) => {
                const [isSelectedDay, isValidDay] = getStateOfDay(dateItem);

                return <button key={dateItem}
                               disabled={!isValidDay}
                               onClick={() => handleSelectDate(Number(dateItem))}
                               aria-disabled={isValidDay}
                               aria-pressed={isSelectedDay}
                               className={clsx("text-xl p-2 rounded-md",
                                   {"text-custom-red": dateItem === todaysDate.getDate() && date.getMonth() === todaysDate.getMonth()},
                                   {"text-gray-400": !isValidDay},
                                   {"hover:bg-gray-300 transition-colors": isValidDay},
                                   {"bg-gray-300": isSelectedDay})}>{dateItem}</button>
            })}
        </div>
    )
}