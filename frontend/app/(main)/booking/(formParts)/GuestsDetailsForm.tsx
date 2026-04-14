import {useController, Control, FieldErrors, UseFormWatch} from "react-hook-form";
import clsx from "clsx";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {SchemaSections} from "@/app/(main)/booking/page";
import {BookingSchemaType} from "@/app/(main)/booking/FormTypes";

// Max number of guests in bookings
export const MAX_NUMBER_GUEST = 6;
// Generates a list from 1 to max number, used to display all options
export const GUESTS_LIST: number[] = Array.from({length: MAX_NUMBER_GUEST + 1}, (_, index) => index + 1);

/**
 * First step of the booking form where user choose how many people will be in the booking
 * @param control - React hook form object to work with controlled components
 * @param errors - validation errors to display field error messages
 * @param watch - watches and returns field values
 * @param setSchemaSelection - callback to navigate between form steps
 */
export default function GuestsDetailsForm({control, errors, watch, setSchemaSelection}:
    {
        control:Control<BookingSchemaType>,
        errors:FieldErrors<BookingSchemaType>,
        watch:UseFormWatch<BookingSchemaType>,
        setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
    }) {
    const [showErrorGuest, setShowErrorGuest] = useState(false);
    const {field} = useController({name: "numberGuest", control})
    const chosenNumberGuest = watch("numberGuest");

    // Handles correct and incorrect number of guests,
    // shows contact message if max guests is selected instead of advancing to next step
    const handleBtnClick = (value: number) => {
        field.onChange(value);
        if (value === MAX_NUMBER_GUEST + 1){
            setShowErrorGuest(true);
        } else {
            setShowErrorGuest(false);
            setSchemaSelection("DATE")
        }
    }

    return (
        <section className={"flex flex-col gap-5"}>
            <h2 className={"text-xl text-custom-gray text-center"}>Velkommen</h2>
            <h3 className={"text-2xl text-center"}>Hvor mange gjester er dere?</h3>
            <input type={"number"}
                   id={"phoneNumber"}
                   aria-label={"choose number of guests"}
                   aria-controls={"number-of-guests"}
                   aria-describedby={"number-of-guests-error"}
                   className={"sr-only"}/>
            <div role={"group"} id="number-of-guests" aria-label={"number of guests buttons"} className={"grid grid-cols-3 gap-3"}>
                {GUESTS_LIST.map((numb: number, index:number) => {
                    // Last button have '+' to indicate max guests or more
                    const buttonText: string = numb !== (MAX_NUMBER_GUEST + 1) ? numb.toString() : numb.toString() + "+"
                    const lastbtn: boolean = numb === MAX_NUMBER_GUEST + 1

                    return <button type="button" key={index}
                                   onClick={() => handleBtnClick(numb)}
                                   aria-pressed={chosenNumberGuest === numb}
                                   className={clsx(
                                       "border-2 border-gray-300 py-2 rounded-md text-xl hover:bg-gray-300 transition-colors",
                                       {"bg-custom-gray text-white border-custom-gray": chosenNumberGuest === numb},
                                       {"col-span-full": lastbtn})}>{buttonText}</button>
                })}
            </div>
            {errors.numberGuest && <span id={"number-of-guests-error"} className={"text-red-800"}>{errors.numberGuest.message}</span>}
            <div aria-live={"polite"} aria-atomic={"true"} role={"alert"}>
                {showErrorGuest &&
                    <div className={"flex items-center bg-custom-eggwhite-dark p-2 rounded-md"}>
                        <InformationCircleIcon className={"w-9 h-9 mr-2"} aria-hidden={"true"}/>
                        <p>Er dere over {MAX_NUMBER_GUEST} personer, ta kontakt med oss på tlf: <a href={"tel:+47-553-136-90"}>+47 553 136 90</a></p>
                    </div>}
            </div>
        </section>
    )
}