export const getShortDay = (dateTime: string): string => {
    const date = new Date(dateTime);
    const options = { weekday: "short" } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const getTwelveHourTime = (dateTime: string): string => {
    var date = new Date(dateTime);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

export const getDateRange = (startDateTime: string, endDateTime: string): string => {
    var startDateTimeString = getShortDateAndTime(startDateTime);
    var endTime = getTwelveHourTime(endDateTime);

    return `${startDateTimeString} - ${endTime}`;

    // Thu 12 Mar 11:15 AM -11:45 AM
}

export const getShortDateAndTime = (dateTime: string) => {

    var startTime = getTwelveHourTime(dateTime);

    return `${getShortDate(dateTime)} ${startTime}`;
}

export const getShortDate = (dateTime: string) => {
    const startDate = new Date(dateTime);

    var day = getShortDay(dateTime);
    var date = startDate.getDate();
    var month = getShortMonth(startDate.getMonth()+1);

    return `${day} ${date} ${month}`;
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