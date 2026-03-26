import React, {useEffect, useState} from "react";
import {SchemaSections} from "@/app/booking/page";
import {Control, FieldErrors, useController, UseFormWatch} from "react-hook-form";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {BookingSchemaType} from "@/app/booking/FormTypes";
import {getMonthToString} from "@/app/utils/utils";
import FormCalendar from "@/app/booking/(formParts)/FormCalendarDays";

let date: Date = new Date();
const maxFutureMonth = 2;
let maxMonth:number = (date.getMonth() + maxFutureMonth + 1) % 12

export default function DateDetailsForm({control, errors, watch, setSchemaSelection}:
    {
        control:Control<BookingSchemaType>,
        errors:FieldErrors<BookingSchemaType>,
        watch:UseFormWatch<BookingSchemaType>,
        setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
    }){
    const {field} = useController({name: "date", control})
    const chosenNumberGuest = watch("numberGuest");
    const chosenFullDate = watch("date");

    // used to deactivate/activate calendar buttons
    const [prevMonth, setPrevMonth] = useState(false)
    const [nextMonth, setNextMonth] = useState(false)

    const todaysDate = new Date();

    const updateCalendarBtn = () => {
        // prevent going back in time
        if (todaysDate.getMonth() < date.getMonth()) {
            setPrevMonth(true)
        } else {
            setPrevMonth(false)
        }
        // prevent going past max month
        if (maxMonth !== (date.getMonth() + 1)){
            setNextMonth(true)
        } else {
            setNextMonth(false)
        }
    }

    const handleBtnClick = (direction:string) => {
        // prevent going back in time
        if (direction === "PREV" && todaysDate < date){
            date.setMonth(date.getMonth() - 1);
        }
        // enforce maximum days ahead a customer can book table
        if (direction === "NEXT" && maxMonth !== (date.getMonth() + 1)){
            date.setMonth(date.getMonth() + 1);
        }
        updateCalendarBtn()
    }

    const handleSelectDate = (dateValue: number) => {
        let month = date.getMonth() + 1;
        let monthString: string = "";
        if (month < 10) {
            monthString = "0" + month.toString()
        } else {
            monthString = month.toString();
        }

        const dateString = `${date.getFullYear()}-${monthString}-${dateValue}`;
        field.onChange(dateString);
        setSchemaSelection("TIME");
    }

    useEffect(()=> {
        updateCalendarBtn();
    }, [])

    return (
        <section className={"flex flex-col gap-5"}>
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenNumberGuest} personer</h2>
            <h3 className={"text-2xl text-center"}>Velg dato</h3>
            <input
                aria-label={"choose date of booking"}
                aria-controls={"calendar"}
                aria-describedby={"calendar-error"}
                className={"sr-only"}/>
            <div role={"group"} id={"calendar"}>
                {/*calendar header*/}
                <div className={"flex justify-between px-1"}>
                    <h4 className={"text-2xl capitalize"}>{getMonthToString(date)} {date.getFullYear()}</h4>
                    <div className={"flex gap-2"}>
                        <button aria-disabled={!prevMonth} disabled={!prevMonth}
                                onClick={() => handleBtnClick("PREV")}>
                            <ArrowLeftIcon
                                className={clsx("w-6",
                                    {"text-gray-500": !prevMonth})}/>
                        </button>
                        <button aria-disabled={!nextMonth} disabled={!nextMonth}
                                onClick={() => handleBtnClick("NEXT")}>
                            <ArrowRightIcon
                                className={clsx("w-6",
                                    {"text-gray-500": !nextMonth})}/>
                        </button>
                    </div>
                </div>
                {/*calendar days*/}
                <FormCalendar date={date} chosenFullDate={chosenFullDate} handleSelectDate={handleSelectDate} />
            </div>
            {errors.date && <span id={"calendar-error"}>{errors.date.message}</span>}
            <button
                onClick={() => setSchemaSelection("GUESTS")}
                className={"mt-5 p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                <ArrowLeftIcon className={"w-8 h-8"}/>
            </button>
        </section>)
}