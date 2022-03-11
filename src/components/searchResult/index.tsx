import React, { useState } from 'react';
import AgencyDetails from '../agencyDetails';
import NewTabLink from '../newTabLink';
import SimpleCarousel from '../simpleCarousel';
import './searchResult.scss';
import { isArchivedInStorage, saveInLocalStorage, getArchivedDataFromLocalStorage } from '../../utils/localStorageHelper';
import { getRelativeShortDate, getShortDate, getShortDateAndTime, getShortDay, getTwelveHourTime } from '../../utils/dateTimeHelper';
import InspectionTimes from '../inspectionTimes';
import DomainListingWrapper from '../../types/domain';

function SearchResult(props: {closestStops: any, data: DomainListingWrapper, showArchived: boolean}) {
    const {
        closestStops, data, showArchived //, isArchivedInStorage
    } = props;

    const [isArchived, setIsArchived] = useState(isArchivedInStorage(data.listing.listingSlug));
    const href = `https://domain.com.au/${data.listing.listingSlug}`;
    const streetAddress = data.listing.propertyDetails.unitNumber
        ? `${data.listing.propertyDetails.unitNumber}/${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`
        : `${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`;
    const imageAltText = `Image for ${streetAddress}`;

    const agent = data.listing.advertiser;

    //Select at most the first two closest stops, then add markup for rendering
    const closestStopsMarkup = closestStops
        .filter((stop, i) => { return i < 2 })
        .map(y => {
            const key = `${data.listing.listingSlug}_${y.stop_name.replace(' ', '')}`;
            return <span className="col-12" key={key}>
                <i className="icon-train" />
                {y.stop_name.replace(' Station', '')}: {Math.round(y.distance * 10) / 10}km
            </span>
        });
    const imageUrls = (data.listing.media ?? [])
        .filter(x => x.category === "Image")
        .map(y => `${y.url}/500x500`);

    const parsePropertyType = (propertyType: string, unitNumber: string, description: string) => {
        switch (propertyType.toLowerCase()) {
            case "NewApartments".toLowerCase():
                return "New Apartment"
            case "ApartmentUnitFlat".toLowerCase():
                // Check the description first, to see if apartment or unit are mentioned
                if (description.toLowerCase().indexOf("apartment") >= 0) {
                    return "Apartment";
                }
                if (description.toLowerCase().indexOf("unit") >= 0) {
                    return "Unit";
                }

                // If it's only numeric, use the value to guess if it's an apartment
                if (new RegExp(/^\d+$/).test(unitNumber)) {
                    const numericUnitNumber = parseInt(unitNumber);

                    // If it's > 99, it's almost definitely an apartment
                    if (numericUnitNumber > 99) {
                        return "Apartment";
                    }

                    // If it's < 20, it's possibly a unit
                    if (numericUnitNumber < 30) {
                        return "Unit";
                    }
                } else {
                    // If it contains a G, it's likely a ground floor apartment
                    if (unitNumber.toLowerCase().indexOf("g") >= 0) {
                        return "Apartment";
                    }

                    // If it contains an A or B, it's potentially a subdivision so likely a unit
                    if (new RegExp(/[ABab]/).test(unitNumber)) {
                        return "Unit";
                    }
                }

                // If nothing matched, return a combined value
                return "Apartment / Unit";
            case "House".toLowerCase():
            case "Townhouse".toLowerCase():
            default:
                return propertyType;
        }
    }

    const propertyType = parsePropertyType(
        data.listing.propertyDetails.propertyType,
        data.listing.propertyDetails.unitNumber,
        data.listing.summaryDescription
    );

    const isAuctionTimeInFuture = data?.listing?.auctionSchedule
        && data.listing.auctionSchedule.time
        && new Date(data.listing.auctionSchedule.time) > new Date()
        ? true : false;

    const openTimes = (data?.listing?.inspectionSchedule?.times ?? []).filter(x => new Date(x.openingTime) > new Date());

    const openTime = openTimes[0]
        ? getRelativeShortDate(openTimes[0].openingTime, true)
        : undefined;

    const auctionDate = data?.listing?.auctionSchedule?.time
        ? getRelativeShortDate(data.listing.auctionSchedule.time, false)
        : undefined;

    return !isArchived || (isArchived && showArchived)
    ? (
        <React.Fragment key={data.listing.listingSlug}>
            <div className="my-2 mx-3 search-result-wrapper">
                <div className={`search-result h-100 ${isArchived ? 'archived' : ''}`}>
                    <div className="border border-secondary h-100 shadow d-flex flex-column ">
                        <div className="px-0 text-center overflow-hidden carousel">
                            <SimpleCarousel
                                id={data.listing.listingSlug}
                                urls={imageUrls}
                                altText={imageAltText}
                            />
                        </div>
                        <AgencyDetails
                            id={`agency_${data.listing.listingSlug}`}
                            name={agent.name}
                            logoUrl={agent.logoUrl}
                            preferredColourHex={agent.preferredColourHex}
                            contacts={agent.contacts}
                            key={`agent_${data.listing.listingSlug}`} />
                        <div className="px-3 pt-1 pb-2 mb-auto">
                            <span className="d-block font-weight-bold text-truncate">{data.listing.priceDetails.displayPrice}</span>
                            <span className="d-block">{streetAddress}</span>
                            <span className="d-block">{data.listing.propertyDetails.suburb} {data.listing.propertyDetails.state} {data.listing.propertyDetails.postcode}</span>
                            <span className="d-block my-1">
                                <span className="badge badge-pill badge-secondary">
                                    {propertyType}
                                </span>
                                {openTime &&
                                    <span className="badge badge-pill badge-success ml-2">
                                        Open {openTime}
                                    </span>
                                }
                                {!openTime && isAuctionTimeInFuture && auctionDate &&
                                     <span className="badge badge-pill badge-danger ml-2">
                                        Auction {auctionDate}
                                    </span>
                                }
                                {(openTime || isAuctionTimeInFuture) &&
                                    <InspectionTimes
                                        id={`inspections_${data.listing.listingSlug}`}
                                        inspectionSchedule={data.listing.inspectionSchedule}
                                        auctionSchedule={data.listing.auctionSchedule}
                                    />
                                }
                            </span>
                            <span className="d-block">
                                <span className="icon-wrapper"><i className="icon-bed" />{data.listing.propertyDetails.bedrooms}</span>
                                <span className="icon-wrapper"><i className="icon-bath" />{data.listing.propertyDetails.bathrooms}</span>
                                <span className="icon-wrapper"><i className="icon-cab" />{data.listing.propertyDetails.carspaces}</span>
                                {auctionDate &&
                                    <span className="icon-wrapper text-danger"><i className="icon-hammer mr-1" />{auctionDate}</span>
                                }
                            </span>
                            <span className="row mt-1">{closestStopsMarkup}</span>
                        </div>
                        <div className="row text-center mb-2">
                            <span className="col-6"><NewTabLink href={href} label="View" className="text-success" /></span>
                            <span className="col-6"><a href="javascript:(0);" className={!isArchived ? "text-danger" : ""} onClick={() => {
                                setIsArchived(!isArchived)
                                saveInLocalStorage(data.listing.listingSlug, !isArchived);
                            }}>{isArchived ? 'Show' : 'Hide'}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
    : <React.Fragment />;
}

export default SearchResult;