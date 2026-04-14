import {useMutation, useQueryClient} from "@tanstack/react-query";
import {BookingSchemaType} from "@/app/(main)/booking/FormTypes";
import axios from "axios";
import {useRouter} from "next/navigation";

/**
 * Custom hook to update existing booking
 */
export default function useBookingUpdate() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (formData: BookingSchemaType) => {
            const response = await axios.put("http://localhost:8080/booking/" + formData.id, formData)
            return response.data
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['specificBooking', data.id], data)
            router.push(`/booking/${data.id}`);
        },
    })
}