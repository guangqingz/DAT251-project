'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import {useState} from "react";
import {InformationCircleIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";

const date = new Date();
const todayDate = date.toISOString().slice(0,10);

type TimeSlot = {
    time: string,
    available: boolean,
}

const timeSlots: TimeSlot[] = [
    {
        time: "13:30",
        available: false,
    }, {
        time: "14:00",
        available: false,
    }, {
        time: "14:30",
        available: false,
    }, {
        time: "15:00",
        available: false,
    }, {
        time: "15:30",
        available: false,
    }, {
        time: "16:00",
        available: false,
    }, {
        time: "16:30",
        available: false,
    }, {
        time: "17:00",
        available: false,
    }, {
        time: "17:30",
        available: true,
    }, {
        time: "18:00",
        available: true,
    }, {
        time: "18:30",
        available: true,
    }, {
        time: "19:00",
        available: true,
    }, {
        time: "19:30",
        available: true,
    }, {
        time: "20:00",
        available: true,
    }, {
        time: "20:30",
        available: true,
    }, {
        time: "21:00",
        available: true,
    }, {
        time: "21:30",
        available: true,
    }
]

const maxNumberGuest = 5;
const guestsList: number[] = Array.from({length: maxNumberGuest}, (_, index) => index + 1);

const testSchema = z.object({
    numberOfGuest: z.number(),
    time: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    comment: z.string().optional()
})

type BookingSchema = z.infer<typeof testSchema>

type SchemaSections = "GUESTS" | "DATE" | "TIME" | "CONTACT"

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
            numberOfGuest: 0,
            time: ""
        }
    })
    const [showErrorGuest, setShowErrorGuest] = useState(false);
    const [schemaSection, setSchemaSection] = useState<SchemaSections>("TIME");

    const selectedTime = watch("time");
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
        setSchemaSection("DATE")
    }

    const handleTime = (time: string) => {
        setValue("time", time, {shouldValidate: true})
        setSchemaSection("CONTACT")
    }

    console.log(selectedNumberOfGuest);
    console.log(showErrorGuest);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"max-w-100 w-full"}>
            {schemaSection === "GUESTS" &&
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>Velkommen</h2>
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
                </section>
            }
            {schemaSection === "DATE" &&
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>
                    <h3 className={"text-2xl text-center"}>Velg dato</h3>
                    <button
                        onClick={() => setSchemaSection("GUESTS")}
                        className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                        <ArrowLeftIcon className={"w-8 h-8"}/>
                    </button>
                </section>
            }
            {schemaSection === "TIME" &&
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>
                    <h2 className={"text-xl text-custom-gray text-center"}>velg dato</h2>
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
                        {timeSlots.map((timeSlot: TimeSlot)=>(
                                <button key={timeSlot.time} type={"button"}
                                    onClick={()=> handleTime(timeSlot.time)}
                                        aria-pressed={selectedTime === timeSlot.time}
                                        aria-disabled={timeSlot.available}
                                        className={clsx(
                                            "border-2 border-gray-300 py-2 rounded-md text-xl",
                                            { "text-custom-green hover:bg-gray-300 transition-colors": timeSlot.available},
                                            {"text-gray-400": !timeSlot.available}
                                            )}>
                                    <p>{timeSlot.time}</p>
                                </button>
                            )
                        )}
                    </div>
                    <button
                        onClick={() => setSchemaSection("DATE")}
                        className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                        <ArrowLeftIcon className={"w-8 h-8"}/>
                    </button>
                </section>
            }
            {schemaSection === "CONTACT" &&
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>
                    <h2 className={"text-xl text-custom-gray text-center"}>kl. {selectedTime}</h2>
                    <h3 className={"text-2xl text-center font-title"}>Fyll ut kontaktinformasjon</h3>

                    <section className={"flex flex-col gap-9 mt-5"}>
                        <div className={"flex flex-col gap-3"}>
                            <input type="email" id="email" {...register("email")}
                                   className={"border-b pb-2 focus:p-2 placeholder-gray-500"}
                                   placeholder={"Din email"}
                                   aria-label={"email"}
                                   aria-describedby={"email-error"}
                            />
                            {errors?.email && <span id={"email-error"} className={"text-red-800"}>Fyll inn email</span>}
                        </div>
                        <div className={"flex flex-col gap-3"}>
                            <input type={"tel"} id={"phoneNumber"} {...register("phoneNumber")}
                                   placeholder={"Ditt telefonnummer"}
                                   className={"border-b pb-2 focus:p-2 placeholder-gray-500"}
                                   aria-label={"telephone number"}
                                   aria-describedby={"phone-number-error"}
                            />
                            {errors?.phoneNumber && <span id={"phone-number-error"} className={"text-red-800"}>Fyll inn telefonnummer</span>}
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <label htmlFor={"comment"} className={"text-gray-500"}>Kommentar</label>
                            <textarea rows={4} className={"border p-2 rounded-md"} id={"comment"} {...register("comment")}/>
                        </div>
                    </section>
                    <div className={"flex justify-between py-3"}>
                        <button
                            onClick={() => setSchemaSection("TIME")}
                            className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                            <ArrowLeftIcon className={"w-8 h-8"}/>
                        </button>
                        <button type="submit"
                                className={"bg-black text-lg text-white w-fit py-2 px-8 rounded-3xl border-2 hover:bg-inherit hover:text-black"}>
                            Reserver
                        </button>
                    </div>
                </section>
            }
        </form>
    )

}