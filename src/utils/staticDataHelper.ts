import { getDateTimeString } from "./dateTimeHelper";

export const getRandomListedDate = (): string => {
    const date = new Date();
    const randomMinutes = randomInt(0, 6000);
    date.setMinutes(date.getMinutes() - randomMinutes);

    // 2022-03-18T19:46:23
    return getDateTimeString(date);
}

function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}