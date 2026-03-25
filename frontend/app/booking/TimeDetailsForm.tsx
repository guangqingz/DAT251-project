import {BookingSchemaType} from "@/app/booking/FormTypes";
import React, {useEffect} from "react";
import {SchemaSections} from "@/app/booking/page";
import {Controller} from "react-hook-form";
import clsx from "clsx";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";

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

export default function TimeDetailsForm({control, errors, formState, setFormStateAction, setSchemaSelection}:
    {
        control:any,
        errors:any,
        formState:Partial<BookingSchemaType>
        setFormStateAction: React.Dispatch<React.SetStateAction<Partial<BookingSchemaType>>>
        setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
    }){
    const mutation = useMutation({
        mutationFn: (timeSlotRequestData: TimeSlotRequestType) => {
            return axios.post(`http://localhost:8080/booking/timeslot`, timeSlotRequestData);
        }
    })

    const timeSlotsExtended: TimeSlotExtendedType[] = mutation.data?.data.map((prev: TimeSlotType)=> ({
        ...prev,
        time: prev.time.slice(0, -3),
        pastTime: isPastTime(prev.time)
    })) ?? [];

    const handleTime = (timeSlot: string) => {
        setFormStateAction(prevState => ({
            ...prevState,
            time: timeSlot
        }));

        setSchemaSelection("CONTACT")
    }

    function isPastTime(time: string): boolean {
        const todaysDate = new Date();

        let month = todaysDate.getMonth() + 1;
        let monthString: string = "";
        if (month < 10) {
            monthString = "0" + month.toString()
        } else {
            monthString = month.toString();
        }
        const dateString = `${todaysDate.getFullYear()}-${monthString}-${todaysDate.getDate()}`;
        const hour = Number(time.split(":")[0])

        // users must minimum book 2 hours before the booking time
        if ((todaysDate.getHours() + 3) > hour && formState.date === dateString){
            return true;
        }
        return false;
    }

    useEffect(()=> {
        const request: TimeSlotRequestType = {
            date: formState.date || "",
            numGuests: formState.numberGuest || 0,
        }
        mutation.mutate(request);
    }, [])

    return (
        <section className={"flex flex-col gap-5"}>
            <h2 className={"text-xl text-custom-gray text-center"}>{formState.numberGuest} personer</h2>
            <h2 className={"text-xl text-custom-gray text-center"}>{formState.date}</h2>
            <label htmlFor="time" className={"text-2xl text-center font-title"}>Velg tid</label>
            <Controller
                control={control}
                name={"time"}
                render={({field}) =>
                    <input type={"text"}
                           aria-label={"choose time of booking"}
                           aria-controls={"time-group"}
                           aria-describedby={"time-error"}
                           className={"sr-only"}
                           {...field}
                           onChange={e => field.onChange(e.target.value)}/>}
            />
            {errors.time && <span id={"time-error"}>{errors.time.message}</span>}
            <div role={"group"} id="time-group" aria-label={"time slots buttons"} className={"grid grid-cols-4 gap-3"}>
                {timeSlotsExtended.map((timeSlot: TimeSlotExtendedType)=>(
                    <button key={timeSlot.time} type={"button"}
                            onClick={()=> handleTime(timeSlot.time)}
                            disabled={!timeSlot.available || timeSlot.pastTime}
                            aria-pressed={formState.time === timeSlot.time}
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