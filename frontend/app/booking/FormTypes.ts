import {z} from "zod";
import {maxNumberGuest} from "@/app/booking/(formParts)/GuestsDetailsForm";
import {CountryCode, isValidPhoneNumber} from "libphonenumber-js";

const customTimeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const customDateRegex = /^\d{4}-\d{2}-\d{2}$/

export const bookingSchema = z.object({
    id: z.string(),
    numberGuest: z.number().min(1, "Minimum 1 gjest").max(maxNumberGuest, `Maximum ${maxNumberGuest} gjester`),
    time: z.string().refine(
        (val:string) => customTimeRegex.test(val), {message: "Ugyldig tidsformat, forventet HH:MM eller HH:MM:SS"}
    ),
    date: z.string().refine(
        (val:string) => customDateRegex.test(val), {message: "Ugyldig dato format, forventet YYYY-MM-DD"}
    ),
    email: z.email({message: "Ugyldig email"}),
    countryCode: z.string(),
    phoneNumber: z.string(),
    comment: z.string().max(255, "Kommentar kan ikke være mer enn 255 karakterer").optional()
}).refine(
    (data) => isValidPhoneNumber(data.phoneNumber, data.countryCode as CountryCode), {
        message: "Ugylig telefonnummer for valgt land",
        path: ["phoneNumber"]
    }
)

export type BookingSchemaType = z.infer<typeof bookingSchema>

export type BookingRequestType = {
    id: string,
    numberGuest: number,
    time: string,
    date: string,
    email: string,
    phoneNumber: string,
    comment?: string,
}

export type TimeSlotType = {
    time: string,
    available: boolean,
}

export type TimeSlotExtendedType = TimeSlotType & {
    pastTime: boolean
}

export type TimeSlotRequestType = {
    date: string,
    numGuests: number
}

