import DomainListingWrapper from "./domain";

export interface DomainListingWrapperWithClosestStops extends DomainListingWrapper {
    closestStops: Array<ClosestStop>;
}

export interface ClosestStop {
    stop_name: string;
    distance: number;
    latitude: number;
    longitude: number;
}

export interface DomainResponseHeaders {
    "x-quota-perday-limit": string;
    "x-quota-perday-remaining": string;
    "x-total-count": string;
    "x-pagination-pagenumber": string;
    "x-pagination-pagesize": string;
}