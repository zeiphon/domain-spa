import { getDateTimeString } from "./dateTimeHelper";

export const getRandomListedDate = (): string => {
    const date = new Date();
    const randomHours = randomInt(1, 100);
    date.setHours(date.getHours() - randomHours);

    // 2022-03-18T19:46:23
    return getDateTimeString(date);
}

function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}