import {useMutation} from "@tanstack/react-query";
import {BookingRequestType} from "@/app/booking/FormTypes";
import axios from "axios";
import {useRouter} from "next/navigation";

/**
 * Custom hook to submit Booking form data to backend and change to confirmation page
 */
export default function useBookingSubmit() {
    const router = useRouter();

    const {mutate, isError, isPending} = useMutation({
        mutationFn: (formData: BookingRequestType) => {
            return axios.post("http://localhost:8080/booking", formData)
        },
        onSuccess: (data) => {
            console.log("Booking successful, query invalidated.")
            console.log(data);
            router.push(`/booking/${data.data.id}`);
        },
    })
    return {mutate, isError, isPending};
}