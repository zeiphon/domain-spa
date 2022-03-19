export const getShortDay = (dateTime: string): string => {
    const date = new Date(dateTime);
    const options = { weekday: "short" } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const getTwelveHourTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

export const getDateRange = (startDateTime: string, endDateTime: string): string => {
    const startDateTimeString = getShortDateAndTime(startDateTime);
    const endTime = getTwelveHourTime(endDateTime);

    return `${startDateTimeString} - ${endTime}`;

    // Thu 12 Mar 11:15 AM -11:45 AM
}

export const getShortDateAndTime = (dateTime: string) => {
    const startTime = getTwelveHourTime(dateTime);

    return `${getRelativeShortDate(dateTime, false)} ${startTime}`;
}

export const getShortDate = (dateTime: string) => {
    const startDate = new Date(dateTime);

    const day = getShortDay(dateTime);
    const date = startDate.getDate();
    const month = getShortMonth(startDate.getMonth()+1);

    return `${day} ${date} ${month}`;
}

export const getRelativeShortDate = (dateTime: string, lowercase: boolean) => {
    const date = new Date(dateTime);
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (date < tomorrow) return lowercase ? 'today' : 'Today';

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    if (date < dayAfterTomorrow) return lowercase ? 'tomorrow' :  'Tomorrow';

    return getShortDate(dateTime);
}

export const getHourDifference = (firstDate: Date, secondDate: Date) => {
    var diff = Math.round(Math.abs(firstDate.getTime() - secondDate.getTime()) / 3600000);
    return diff;
}

export const getDateTimeString = (date: Date) => {
    return `${date.getFullYear()}-${ensureTwoDigits(date.getMonth()+1)}-${ensureTwoDigits(date.getDate())}T${ensureTwoDigits(date.getHours())}:${ensureTwoDigits(date.getMinutes())}:${ensureTwoDigits(date.getSeconds())}`;
}

const ensureTwoDigits = (number: number): string => {
    return number < 10 ? `0${number}` : number.toString();
}

const getShortMonth = (monthIndex: number) => {
    switch(monthIndex) {
        case 1:  return 'Jan';
        case 2:  return 'Feb';
        case 3:  return 'Mar';
        case 4:  return 'Apr';
        case 5:  return 'May';
        case 6:  return 'Jun';
        case 7:  return 'Jul';
        case 8:  return 'Aug';
        case 9:  return 'Sep';
        case 10: return 'Oct';
        case 11: return 'Nov';
        case 12: return 'Dec';
    }
}