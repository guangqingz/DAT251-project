import React, {useEffect} from "react";
import {SchemaSections} from "@/app/booking/page";
import {Control, FieldErrors, useController, UseFormWatch} from "react-hook-form";
import clsx from "clsx";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {BookingSchemaType} from "@/app/booking/FormTypes";
import {isPastTime} from "@/app/utils/utils";

type TimeSlotType = {
    time: string,
    available: boolean,
}

type TimeSlotExtendedType = {
    time: string,
    available: boolean,
    pastTime: boolean
}

type TimeSlotRequestType = {
    date: string,
    numGuests: number
}

export default function TimeDetailsForm({control, errors, watch, setSchemaSelection}:
    {
        control:Control<BookingSchemaType>,
        errors:FieldErrors<BookingSchemaType>,
        watch:UseFormWatch<BookingSchemaType>,
        setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
    }){
    const {field} = useController({name: "time", control})
    const chosenNumberGuest = watch("numberGuest");
    const chosenFullDate = watch("date");
    const chosenTime = watch("time");

    const mutation = useMutation({
        mutationFn: (timeSlotRequestData: TimeSlotRequestType) => {
            return axios.post(`http://localhost:8080/booking/timeslot`, timeSlotRequestData);
        }
    })

    const timeSlotsExtended: TimeSlotExtendedType[] = mutation.data?.data.map((prev: TimeSlotType)=> ({
        ...prev,
        time: prev.time.slice(0, -3),
        pastTime: isPastTime(prev.time, chosenFullDate)
    })) ?? [];

    const handleTime = (timeSlot: string) => {
        field.onChange(timeSlot);
        setSchemaSelection("CONTACT")
    }

    useEffect(()=> {
        const request: TimeSlotRequestType = {
            date: chosenFullDate || "",
            numGuests: chosenNumberGuest || 0,
        }
        mutation.mutate(request);
    }, [])

    return (
        <section className={"flex flex-col gap-5"}>
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenNumberGuest} personer</h2>
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenFullDate}</h2>
            <label htmlFor="time" className={"text-2xl text-center font-title"}>Velg tid</label>
                    <input type={"text"}
                           aria-label={"choose time of booking"}
                           aria-controls={"time-group"}
                           aria-describedby={"time-error"}
                           className={"sr-only"}/>
            {errors.time && <span id={"time-error"}>{errors.time.message}</span>}
            <div role={"group"} id="time-group" aria-label={"time slots buttons"} className={"grid grid-cols-4 gap-3"}>
                {timeSlotsExtended.map((timeSlot: TimeSlotExtendedType)=>(
                    <button key={timeSlot.time} type={"button"}
                            onClick={()=> handleTime(timeSlot.time)}
                            disabled={!timeSlot.available || timeSlot.pastTime}
                            aria-pressed={chosenTime === timeSlot.time}
                            aria-disabled={timeSlot.available}
                            className={clsx(
                                "relative border-2 border-gray-300 py-2 rounded-md text-xl",
                                { "text-custom-green hover:bg-gray-300 transition-colors": timeSlot.available && !timeSlot.pastTime},
                                {"text-gray-400": timeSlot.pastTime}
                            )}>
                        <p>{timeSlot.time}</p>
                        {(!timeSlot.available && !timeSlot.pastTime) &&
                            <div className={"bg-red-400 w-2 h-2 absolute right-1 top-1 rounded-full"}></div>}
                    </button>)
                )}
            </div>
            <button
                onClick={() => setSchemaSelection("DATE")}
                className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                <ArrowLeftIcon className={"w-8 h-8"}/>
            </button>
        </section>
    )
}