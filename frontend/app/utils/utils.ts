import {CountryCallingCode, CountryCode, getCountryCallingCode, isValidPhoneNumber} from "libphonenumber-js";

/**
 * Converts given date into month in full text
 * @param date - date to be used
 * @return String - month (ex. March)
 */
export function getMonthToString(date: Date){
    return date.toLocaleDateString("no-NO", {month: "long"});
}

/**
 * Transform date object to string format (YYYY-MM-DD)
 * @param date - to transform
 * @return String - YYYY-MM-DD
 */
export function dateToString(date: Date): string{
    const month: number = date.getMonth() + 1
    const monthString: string = month < 10 ? "0" + month : month.toString()
    const day: number = date.getDate()
    const dateString: string = day < 10 ? "0" + day : day.toString()

    return `${date.getFullYear()}-${monthString}-${dateString}`
}

/**
 * Checks if phone number and selected country code is valid
 * @param phoneNumber to check
 * @param co to check
 * @return true if both phone number and country code is valid, false ohterwise
 */
export function checkPhoneNumberInput(phoneNumber: string, co: CountryCode ): Boolean{
    const callingCode: CountryCallingCode = getCountryCallingCode(co);
    // if applicable, check if prefix is the same as selected country code
    if (phoneNumber.startsWith("+")){
        if (!phoneNumber.startsWith("+" + callingCode)){
            return false;
        }
    }
    return isValidPhoneNumber(phoneNumber, co);
}