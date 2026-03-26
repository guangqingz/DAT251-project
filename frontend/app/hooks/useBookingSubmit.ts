import {useMutation} from "@tanstack/react-query";
import {BookingSchemaType} from "@/app/booking/FormTypes";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function useBookingSubmit() {
    const router = useRouter();

    const {mutate} = useMutation({
        mutationFn: (formData: BookingSchemaType) => {
            return axios.post("http://localhost:8080/booking", formData)
        },
        onSuccess: (data) => {
            console.log("Booking successful, query invalidated.")
            console.log(data);
            router.push(`/booking/${data.data.id}`);
        },
    })
    return mutate;
}