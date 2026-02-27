'use client';

import {z} from "zod";
import {useForm, SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import clsx from "clsx";

const customTimeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const bookingSchema = z.object({
    numberOfGuest: z.coerce.number(),
    time: z.string().refine(
        (val) => customTimeRegex.test(val),
        {
            message: "Invalid time format, expected HH:MM or HH:MM:SS",
        }),
    date: z.coerce.date(),
})

type FormInput = z.input<typeof bookingSchema>;
type FormOutput = z.output<typeof bookingSchema>;

const date = new Date();
const todayDate = date.toISOString().slice(0,10);

const times = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

export default function Page () {
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(bookingSchema)
    })

    const selectedTime = watch("time");

    const onSubmit: SubmitHandler<FormOutput> = (data) => {
        console.log("FORM SUBMITTED")
        console.log(data)
    }

    console.log(getValues());
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-3"}>
            <div className={"mt-6 w-full max-w-[400px] m-auto"}>
                <div className={"flex flex-col border-2 px-4 py-2 rounded-xs border-gray-400 w-full"}>
                    <label htmlFor="numberOfGuest">Gjester</label>
                    <select id="numberOfGuest" {...register("numberOfGuest")}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div className={"w-full mt-2"}>
                    <div className={"flex flex-col border-2 px-4 py-2 mb-2 rounded-xs border-gray-400"}>
                        <label htmlFor="start">Velg dato</label>
                        <input type="date" id="start" min={todayDate} max="2050-12-31"{...register("date")}/>
                    </div>
                    {errors?.date && <span className={"text-red-800"}>Fyll inn dato</span>}
                </div>
            </div>
            <div className={"flex flex-col items-center"}>
                <label htmlFor="time" className={"font-bold text-2xl mt-6 mb-3"}>Velg tid</label>
                <input id={"time"} {...register("time")} className={"hidden"}/>
                {errors?.time && <span className={"text-red-800 mb-2"}>Velg et tidspunkt</span>}
                <div className={"grid grid-cols-4 gap-1"}>
                    {times.map((time)=>(
                            <button onClick={()=> setValue("time", time, {shouldValidate: true})} key={time} type={"button"}
                                 className={clsx(
                                     "p-4 rounded-xs border-2 bg-custom-green hover:bg-light-custom-green hover:border-light-custom-green",
                                     selectedTime == time ? "border-red" : "border-custom-green"
                                 )
                                }>
                                <p>{time}</p>
                            </button>
                        )
                    )}
                </div>
            </div>
            <div className={"flex justify-center mt-2"}>
                <button type="submit">
                    Book
                </button>
            </div>
        </form>
    )
}