import {SubmitHandler, useForm} from "react-hook-form";
import {CustomerFormInput, CustomerFormOutput, customerDetails} from "@/app/booking/FormTypes";
import {zodResolver} from "@hookform/resolvers/zod";

export default function CustomerDetailsForm({setCustomerDetails}:{setCustomerDetails:any}){
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormInput, any, CustomerFormOutput>({
        resolver: zodResolver(customerDetails)
    })

    const onSubmit: SubmitHandler<CustomerFormOutput> = (data) => {
        console.log("FORM CUSTOMER DETAILS SUBMITTED")
        console.log(data)
        setCustomerDetails(data)
    }

    return (<form onSubmit={handleSubmit(onSubmit)} className={"mt-10 flex flex-col items-center gap-10"}>
        <h2 className={"text-3xl"}>Fyll ut kontaktinformasjon</h2>
        <div className={"flex flex-col gap-10 w-full max-w-100"}>
            <div className={"flex flex-col gap-3"}>
                <input type="email" id="email" {...register("email")}
                       className={"border-b pb-2 focus:p-2"}
                       placeholder={"Din email"}
                       aria-label={"email"}
                />
                {errors?.email && <span className={"text-red-800"}>Fyll inn email</span>}
            </div>
            <div className={"flex flex-col gap-3"}>
                <input type={"tel"} id={"phoneNumber"} {...register("phoneNumber")}
                       placeholder={"Ditt telefonnummer"}
                       className={"border-b pb-2 focus:p-2"}
                       aria-label={"telefonnummer"}
                />
                {errors?.phoneNumber && <span className={"text-red-800"}>Fyll inn telefonnummer</span>}
            </div>
            <div className={"flex flex-col gap-2"}>
                <label htmlFor={"comment"}>Kommentar til restauranten</label>
                <textarea rows={4} className={"border p-2"} id={"comment"} {...register("comment")}/>
            </div>
            <div className={"flex justify-center mt-2"}>
                <button type="submit" className={"p-2 bg-gray-400 rounded-md px-3 border-2 border-gray-400 hover:bg-white hover:border-2 hover:border-gray-400"}>
                    Reserver
                </button>
            </div>
        </div>
    </form>
    )
}