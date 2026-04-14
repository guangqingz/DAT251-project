import {z} from "zod";
import {MAX_NUMBER_GUEST} from "@/app/(main)/booking/(formParts)/GuestsDetailsForm";
import {CountryCode} from "libphonenumber-js";
import {checkPhoneNumberInput} from "@/app/utils/utils";

const customTimeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const customDateRegex = /^\d{4}-\d{2}-\d{2}$/

export const bookingSchema = z.object({
    id: z.string(),
    numberGuest: z.number().min(1, "Minimum 1 gjest").max(MAX_NUMBER_GUEST, `Maximum ${MAX_NUMBER_GUEST} gjester`),
    time: z.string().refine(
        (val:string) => customTimeRegex.test(val), {message: "Ugyldig tidsformat, velg en tid"}
    ),
    date: z.string().refine(
        (val:string) => customDateRegex.test(val), {message: "Ugyldig dato format, velg en dato"}
    ).refine(
        (val:string) => {
            const [year, month, day] = val.split("-").map(Number);
            const date = new Date(year, month - 1, day);
            return date.getDay() !== 1;
        }, {message: "Mandager er ikke tilgjengelig"}
    ),
    email: z.email({message: "Ugyldig email"}),
    countryCode: z.string(),
    phoneNumber: z.string({message: "Ugylig telefonnummer for valgt land"}),
    comment: z.string().max(255, "Kommentar kan ikke være mer enn 255 karakterer").optional()
}).refine(
    (data) => checkPhoneNumberInput(data.phoneNumber, data.countryCode as CountryCode), {
        message: "Ugylig telefonnummer for valgt land",
        path: ["phoneNumber"]
    }
)

export type BookingSchemaType = z.infer<typeof bookingSchema>

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