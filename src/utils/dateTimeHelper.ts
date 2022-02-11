export const getShortDay = (dateTime: string): string => {
    const date = new Date(dateTime);
    const options = { weekday: "short" } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const getTwelveHourTime = (dateTime: string): string => {
    var date = new Date(dateTime);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}