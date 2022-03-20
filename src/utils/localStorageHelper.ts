const _archivedDataLocalStorageKey = 'DPS_archivedListings';
export const getArchivedDataFromLocalStorage = (): {} => {
    return JSON.parse(localStorage.getItem(_archivedDataLocalStorageKey) ?? '{}');
}

export const isArchivedInStorage = (key: string) => {
    const storageData = getArchivedDataFromLocalStorage();
    return storageData && storageData[key];
}

export function saveInLocalStorage(key: string, archive: boolean): void {
    const storedData = getArchivedDataFromLocalStorage();

    if (archive) {
        storedData[key] = true;
    } else {
        delete storedData[key];
    }

    localStorage.setItem(_archivedDataLocalStorageKey, JSON.stringify(storedData));
}

const _searchParamsLocalStorageKey = 'DPS_searchParams';
export function loadSearchParamsFromLocalStorage(): {
    minBeds?: number;
    minBaths?: number;
    minCarSpaces?: number;
    maxPrice?: number;
    maxDistFromTrain?: number;
    suburbCsv?: string;
    state?: string;
} {
    return JSON.parse(localStorage.getItem(_searchParamsLocalStorageKey) ?? '{}');
}
export function saveSearchParamsToLocalStorage(
    minBeds: number,
    minBaths: number,
    minCarSpaces: number,
    maxPrice: number,
    maxDistFromTrain: number,
    suburbCsv: string,
    state: string): void {
        window.localStorage.setItem(_searchParamsLocalStorageKey, JSON.stringify({
            'minBeds': minBeds,
            'minBaths': minBaths,
            'minCarSpaces': minCarSpaces,
            'maxPrice': maxPrice,
            'maxDistFromTrain': maxDistFromTrain,
            'suburbCsv': suburbCsv,
            'state': state
        }));
};