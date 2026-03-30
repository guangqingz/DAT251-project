import clsx from "clsx";
import React from "react";

const DAYS: string[] = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"]

/**
 * Renders a calendar grid for a given month and allows users to select a date
 * @param date - month and year to display
 * @param chosenFullDate - currently selected date
 * @param handleSelectDate - callback triggered when user selects a date
 */
export default function FormCalendarDays({date, chosenFullDate, handleSelectDate}:{
    date: Date, chosenFullDate: string, handleSelectDate:(value: number) => void
}){
    // Used to decide the days in the calendar
    const FIRST_DAY_OF_MONTH = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const LAST_DAT_OF_MONTH = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const GRID_SPACE = (FIRST_DAY_OF_MONTH + 6) % 7; // Used to place the date numbers under correct day
    const DATE_IN_MONTH: number[] = Array.from({length: LAST_DAT_OF_MONTH}, (_, index) => index + 1);

    const todaysDate = new Date();

    /**
     * Checks if given date is already selected by user, and if it's valid (not in the past)
     * @param dateItem - date to check
     * @return Boolean
     */
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
            {/*Displays days of the week*/}
            {DAYS.map((day: string) =>
                <h4 key={day} className={"text-xl"}>{day}</h4>
            )}
            {/*Add empty spaces in the grid to align the date under correct day*/}
            {Array.from({length: GRID_SPACE}).map((_, i) => (
                <div key={i}></div>
            ))}
            {/*Displays all dates in the current month*/}
            {DATE_IN_MONTH.map((dateItem: number) => {
                const [isSelectedDay, isValidDay] = getStateOfDay(dateItem);

                return <button key={dateItem} type={"button"}
                               disabled={!isValidDay}
                               onClick={() => handleSelectDate(Number(dateItem))}
                               aria-disabled={!isValidDay}
                               aria-pressed={isSelectedDay}
                               className={clsx("text-xl p-2 rounded-md",
                                   {"text-custom-red": dateItem === todaysDate.getDate() && date.getMonth() === todaysDate.getMonth()},
                                   {"text-gray-600 line-through": !isValidDay},
                                   {"hover:bg-gray-300 transition-colors": isValidDay},
                                   {"bg-gray-300": isSelectedDay})}>{dateItem}</button>
            })}
        </div>
    )
}