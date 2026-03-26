import {z} from "zod";

// const customTimeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
//
// export const bookingSchema = z.object({
//     numberGuest: z.coerce.number(),
//     time: z.string().refine(
//         (val) => customTimeRegex.test(val),
//         {
//             message: "Invalid time format, expected HH:MM or HH:MM:SS",
//         }),
//     date: z.string(),
//     email: z.email(),
//     phoneNumber: z.string().length(8, "Telefonnummer må være på 8 siffer"),
//     comment: z.string().optional(),
// })
//
// export type BookingSchema = z.infer<typeof bookingSchema>

import {maxNumberGuest} from "@/app/booking/(formParts)/GuestsDetailsForm";

export const bookingSchema = z.object({
    numberGuest: z.number().min(1, "Minimum 1 guest").max(maxNumberGuest, `Maximum ${maxNumberGuest}`),
    time: z.string(),
    date: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    comment: z.string().optional()
})

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

