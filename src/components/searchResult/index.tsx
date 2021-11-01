import React, { useState } from 'react';
import AgencyDetails from '../agencyDetails';
import NewTabLink from '../newTabLink';
import SimpleCarousel from '../simpleCarousel';
import './searchResult.scss';
import { isArchivedInStorage, saveInLocalStorage, getArchivedDataFromLocalStorage } from '../../utils/localStorageHelper';

function SearchResult(props: any) {
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

    return !isArchived || (isArchived && showArchived)
    ? (
        <React.Fragment key={data.listing.listingSlug}>
            <div className="my-2 search-result-wrapper mr-3">
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
                            id={data.listing.listingSlug}
                            name={agent.name}
                            logoUrl={agent.logoUrl}
                            preferredColourHex={agent.preferredColourHex}
                            contacts={agent.contacts}
                            key={`agent_${data.listing.listingSlug}`} />
                        <div className="px-3 pt-1 pb-2 mb-auto">
                            <span className="d-block font-weight-bold text-truncate">{data.listing.priceDetails.displayPrice}</span>
                            <span className="d-block">{streetAddress}</span>
                            <span className="d-block">{data.listing.propertyDetails.suburb} {data.listing.propertyDetails.state} {data.listing.propertyDetails.postcode}</span>
                            <span className="d-block">
                                <span className="badge badge-pill badge-secondary">
                                    {propertyType}
                                </span>
                            </span>
                            <span className="d-block">
                                <span className="icon-wrapper"><i className="icon-bed" />{data.listing.propertyDetails.bedrooms}</span>
                                <span className="icon-wrapper"><i className="icon-bath" />{data.listing.propertyDetails.bathrooms}</span>
                                <span className="icon-wrapper"><i className="icon-cab" />{data.listing.propertyDetails.carspaces}</span>
                            </span>
                            <span className="row">{closestStopsMarkup}</span>
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