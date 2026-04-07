/**
 * Converts given date into month in full text
 * @param date - date to be used
 * @return String - month (ex. March)
 */
export function getMonthToString(date: Date){
    return date.toLocaleDateString("no-NO", {month: "long"});
}
