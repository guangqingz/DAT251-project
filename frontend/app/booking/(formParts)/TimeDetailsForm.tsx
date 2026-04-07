import React, {useEffect} from "react";
import {SchemaSections} from "@/app/booking/page";
import {Control, FieldErrors, useController, UseFormWatch} from "react-hook-form";
import clsx from "clsx";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {BookingSchemaType, TimeSlotExtendedType} from "@/app/booking/FormTypes";
import {useTimeSlots} from "@/app/hooks/useTimeSlots";

/**
 * Third step of the booking form where user choose the time of booking
 * @param control - React hook form object to work with controlled components
 * @param errors - validation errors to display field error messages
 * @param watch - watches and returns field values
 * @param setSchemaSelection - callback to navigate between form steps
 */
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

    const timeSlotsExtended = useTimeSlots(chosenNumberGuest, chosenFullDate);

    const handleTime = (timeSlot: string) => {
        field.onChange(timeSlot);
        setSchemaSelection("CONTACT")
    }

    useEffect(() => {
        // make sure the chosen time slot is updated if the date or time slot list changes
        const selectedTimeSlot = timeSlotsExtended.find(slot => slot.time === chosenTime)
        if (selectedTimeSlot && (!selectedTimeSlot.available || selectedTimeSlot?.pastTime)){
            field.onChange("")
        }
    }, [chosenFullDate, timeSlotsExtended])

    return (
        <section className={"flex flex-col gap-5"}>
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenNumberGuest} personer</h2>
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenFullDate}</h2>
            <label htmlFor="timeSlot" className={"text-2xl text-center font-title"}>Velg tid</label>
                    <input type={"text"}
                           id={"timeSlot"}
                           aria-controls={"time-group"}
                           aria-describedby={"time-error"}
                           className={"sr-only"}/>
            <div role={"group"} id="time-group" aria-label={"time slots buttons"} className={"grid grid-cols-4 gap-3"}>
                {timeSlotsExtended.map((timeSlot: TimeSlotExtendedType)=>
                    <button key={timeSlot.time} type={"button"}
                                   onClick={()=> handleTime(timeSlot.time)}
                                   disabled={!timeSlot.available || timeSlot.pastTime}
                                   aria-pressed={chosenTime === timeSlot.time}
                                   aria-disabled={!timeSlot.available}
                                   className={clsx(
                                       "relative border-2 py-2 rounded-md text-xl",
                                       { "text-custom-green hover:bg-gray-300 transition-colors border-custom-green cursor-pointer": timeSlot.available && !timeSlot.pastTime},
                                       {"text-custom-gray border-gray-400": timeSlot.pastTime},
                                       {"bg-gray-300": chosenTime === timeSlot.time}
                                   )}>
                        <span>{timeSlot.time.slice(0,5)}</span>
                        {timeSlot.pastTime && <span className={"sr-only"}>Ikke tilgjenglig fordi tiden er passert eller det er mindre enn 2 timer før</span>}
                        {(!timeSlot.available && !timeSlot.pastTime) &&
                            <>
                                <div className={"bg-red-400 w-2 h-2 absolute right-1 top-1 rounded-full"}></div>
                                <span className={"sr-only"}>Ikke tilgjengelig fordi booking er fullt</span>
                            </>
                        }
                    </button>
                )}
            </div>
            {errors.time && <span id={"time-error"} className={"text-red-800"}>{errors.time.message}</span>}
            <button type={"button"}
                aria-label={"Go back to choosing date of booking"}
                onClick={() => setSchemaSelection("DATE")}
                className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                <ArrowLeftIcon className={"w-8 h-8"} aria-hidden={true}/>
            </button>
        </section>
    )
}