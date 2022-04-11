import { AuctionSchedule } from "../types/domain";
import { getDateTimeString } from "./dateTimeHelper";

export const getRandomListedDate = (): string => {
    return getDateTimeString(
        getRandomDate((-5 * 24 * 60), 0) // Up to 5 days in the past
    );
}

export const getRandomAuctionSchedule = (): AuctionSchedule | undefined => {
    const rand = randomInt(1, 3);
    return rand < 3 // Approx 2/3 listings will have an auction schedule
        ? {
            time: getAuctionDate(),
            auctionLocation: ""
        }
        : undefined;
}

const getAuctionDate = () : string => {
    const date = getRandomDate(0, (28 * 24 * 60)) // Up to 28 days in the future
    const rand = randomInt(1, 3);

    switch (rand) {
        case 1:
            date.setHours(10);
            date.setMinutes(0);
            break;
        case 2:
            date.setHours(12);
            date.setMinutes(15);
            break;
        case 3:
            date.setHours(14);
            date.setMinutes(30);
            break;
        default:
            date.setHours(9);
            date.setMinutes(0);
    }

    return getDateTimeString(
        date
    );
}

const getRandomDate = (minMinuteOffset: number, maxMinuteOffset: number): Date => {
    const date = new Date();
    const randomMinutes = randomInt(minMinuteOffset, maxMinuteOffset);
    date.setMinutes(date.getMinutes() + randomMinutes);

    // 2022-03-18T19:46:23
    return date;
}

function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}