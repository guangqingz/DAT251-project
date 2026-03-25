import {Controller} from "react-hook-form";
import clsx from "clsx";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {BookingSchema2} from "@/app/booking/FormTypes";
import {SchemaSections} from  "@/app/booking/BookingDetailsForm";

const maxNumberGuest = 5;
const guestsList: number[] = Array.from({length: maxNumberGuest}, (_, index) => index + 1);

export default function GuestsDetailsForm({control, errors, formState, setFormStateAction, setSchemaSelection}:
    {
        control:any,
        errors:any,
        formState:Partial<BookingSchema2>
        setFormStateAction: React.Dispatch<React.SetStateAction<Partial<BookingSchema2>>>
        setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
    }) {
    const [showErrorGuest, setShowErrorGuest] = useState(false);

    const handleBtnClick = (value: number) => {
        setFormStateAction(prevState => ({
            ...prevState,
            numberGuest: value
        }));
        if (value === maxNumberGuest){
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
            <Controller
                control={control}
                name={"numberGuest"}
                render={({field}) =>
                    <input type={"number"}
                           aria-label={"choose number of guests"}
                           aria-controls={"number-of-guests"}
                           aria-describedby={"number-of-guests-error"}
                           className={"sr-only"}
                           {...field}
                           onChange={e => field.onChange(Number(e.target.value))}/>}
            />
            <div role={"group"} id="number-of-guests" aria-label={"number of guests buttons"} className={"grid grid-cols-4 gap-3"}>
                {guestsList.map((numb: number, index:number) => {
                    const buttonText: string = numb !== maxNumberGuest ? numb.toString() : numb.toString() + "+"
                    const lastbtn: boolean = numb === maxNumberGuest

                    return <button type="button" key={index}
                                   onClick={() => handleBtnClick(numb)}
                                   aria-pressed={formState.numberGuest === numb}
                                   className={clsx(
                                       "border-2 border-gray-300 py-2 rounded-md text-xl hover:bg-gray-300 transition-colors",
                                       {"bg-custom-gray text-white border-custom-gray": formState.numberGuest === numb},
                                       {"col-span-full": lastbtn})}>{buttonText}</button>
                })}
            </div>
            {errors.numberGuest && <span id={"number-of-guests-error"}>{errors.numberGuest.message}</span>}
            {showErrorGuest &&
                <div className={"flex items-center bg-custom-eggwhite-dark p-2 rounded-md"}>
                    <InformationCircleIcon className={"w-9 h-9 mr-2"}/>
                    <p>Er dere over {maxNumberGuest} personer, ta kontakt med oss på tlf: <a href={"tel:+47-553-136-90"}>+47 553 136 90</a></p>
                </div>}
        </section>
    )
}