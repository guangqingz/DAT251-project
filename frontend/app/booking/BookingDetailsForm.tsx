'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import {useState} from "react";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";

const date = new Date();
const todayDate = date.toISOString().slice(0,10);
const times = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
const maxNumberGuest = 5;
const guestsList: number[] = Array.from({length: maxNumberGuest}, (_, index) => index + 1);

const testSchema = z.object({
    numberOfGuest: z.number(),
})

type BookingSchema = z.infer<typeof testSchema>

export default function BookingDetailsForm({setBookingDetails}:{setBookingDetails: any}){
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<BookingSchema>({
        resolver: zodResolver(testSchema),
        defaultValues:{
            numberOfGuest: 0
        }
    })
    const [showErrorGuest, setShowErrorGuest] = useState(false);

    //const selectedTime = watch("time");
    const selectedNumberOfGuest = watch("numberOfGuest");

    const onSubmit: SubmitHandler<BookingSchema> = (data) => {
        console.log("FORM BOOKING DETAILS SUBMITTED")
        console.log(data)
        setBookingDetails(data)
    }

    console.log(getValues());
    console.log(errors);

    const handleWrongGuests = () => {
        setShowErrorGuest(true);
        setValue("numberOfGuest", maxNumberGuest, {shouldValidate: true});
    }

    const handleCorrectGuests = (value: number) => {
        setValue("numberOfGuest", value, {shouldValidate: true});
        setShowErrorGuest(false);
    }

    console.log(selectedNumberOfGuest);
    console.log(showErrorGuest);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"mt-10 max-w-100 w-full"}>
            <section className={"flex flex-col gap-5"}>
                <h3 className={"text-2xl text-center"}>Hvor mange gjester er dere?</h3>
                <Controller
                    control={control}
                    name={"numberOfGuest"}
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
                                onClick={ lastbtn ? handleWrongGuests : () => handleCorrectGuests(numb) }
                                aria-pressed={selectedNumberOfGuest === numb}
                                className={clsx(
                                   "border-2 border-gray-300 py-2 rounded-md text-xl hover:bg-gray-300 transition-colors",
                                   {"bg-custom-gray text-white border-custom-gray": selectedNumberOfGuest === numb},
                                    {"col-span-full": lastbtn})}>{buttonText}</button>
                    })}
                </div>
                {errors.numberOfGuest && <span id={"number-of-guests-error"}>{errors.numberOfGuest.message}</span>}
                {showErrorGuest &&
                    <div className={"flex items-center bg-custom-eggwhite-dark p-2 rounded-md"}>
                        <InformationCircleIcon className={"w-9 h-9 mr-2"}/>
                        <p>Er dere over {maxNumberGuest} personer, ta kontakt med oss</p>
                    </div>}
                <div className={"flex justify-center mt-2"}>
                    <button type="submit">
                        Book
                    </button>
                </div>
            </section>
                {/*<section className={"flex flex-col gap-3"}>*/}
                {/*    <div className={"mt-6 w-full max-w-100 m-auto"}>*/}
                {/*        <div className={"flex flex-col border-2 px-4 py-2 rounded-xs border-gray-400 w-full"}>*/}
                {/*            <label htmlFor="numberOfGuest">Gjester</label>*/}
                {/*            <select id="numberOfGuest" {...register("numberOfGuest")}>*/}
                {/*                <option value="1">1</option>*/}
                {/*                <option value="2">2</option>*/}
                {/*                <option value="3">3</option>*/}
                {/*                <option value="4">4</option>*/}
                {/*            </select>*/}
                {/*        </div>*/}
                {/*        <div className={"w-full mt-2"}>*/}
                {/*            <div className={"flex flex-col border-2 px-4 py-2 mb-2 rounded-xs border-gray-400"}>*/}
                {/*                <label htmlFor="start">Velg dato</label>*/}
                {/*                <input type="date" id="start" min={todayDate} max="2050-12-31"{...register("date")}/>*/}
                {/*            </div>*/}
                {/*            {errors?.date && <span className={"text-red-800"}>Fyll inn dato</span>}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className={"flex flex-col items-center"}>*/}
                {/*        <label htmlFor="time" className={"font-bold text-2xl mt-6 mb-3"}>Velg tid</label>*/}
                {/*        <input id={"time"} {...register("time")} className={"hidden"}/>*/}
                {/*        {errors?.time && <span className={"text-red-800 mb-2"}>Velg et tidspunkt</span>}*/}
                {/*        <div className={"grid grid-cols-4 gap-1"}>*/}
                {/*            {times.map((time)=>(*/}
                {/*                    <button onClick={()=> setValue("time", time, {shouldValidate: true})} key={time} type={"button"}*/}
                {/*                            className={clsx(*/}
                {/*                                "p-4 rounded-xs border-2 bg-custom-green hover:bg-light-custom-green hover:border-light-custom-green",*/}
                {/*                                selectedTime == time ? "border-red" : "border-custom-green"*/}
                {/*                            )*/}
                {/*                            }>*/}
                {/*                        <p>{time}</p>*/}
                {/*                    </button>*/}
                {/*                )*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className={"flex justify-center mt-2"}>*/}
                {/*        <button type="submit">*/}
                {/*            Book*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</section>*/}
        </form>
    )

}