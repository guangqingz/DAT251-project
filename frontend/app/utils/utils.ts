export function getMonthToString(date: Date){
    return date.toLocaleDateString("no-NO", {month: "long"});
}

export function isPastTime(time: string, chosenFullDate: string): boolean {
    const todaysDate = new Date();

    let month = todaysDate.getMonth() + 1;
    let monthString: string = "";
    if (month < 10) {
        monthString = "0" + month.toString()
    } else {
        monthString = month.toString();
    }
    const dateString = `${todaysDate.getFullYear()}-${monthString}-${todaysDate.getDate()}`;
    const hour = Number(time.split(":")[0])

    // users must minimum book 2 hours before the booking time
    if ((todaysDate.getHours() + 3) > hour && chosenFullDate === dateString){
        return true;
    }
    return false;
}