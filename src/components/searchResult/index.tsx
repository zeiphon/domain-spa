import React from 'react';
import NewTabLink from '../newTabLink';
import SimpleCarousel from '../simpleCarousel';

function SearchResult(props: any) {
    const {
        closestStops, data
    } = props;

    const href = `https://domain.com.au/${data.listing.listingSlug}`;
    const streetAddress = data.listing.propertyDetails.unitNumber
        ? `${data.listing.propertyDetails.unitNumber}/${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`
        : `${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`;
    const imageAltText = `Image for ${streetAddress}`;

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
    const imageUrls = data.listing.media
        .filter(x => x.category === "Image")
        .map(y => y.url);

    return (
        <>
            <div className="col-md-4 col-lg-3 my-2">
                <div className="search-result mx-auto h-100">
                    <div className="border border-secondary h-100 shadow d-flex flex-column ">
                        <div className="px-0 text-center overflow-hidden carousel">
                            <SimpleCarousel key={data.listingSlug} urls={imageUrls} />
                        </div>
                        <div className="px-3 pt-1 pb-2 mb-auto">
                            <span className="d-block font-weight-bold text-truncate">{data.listing.priceDetails.displayPrice}</span>
                            <span className="d-block">{streetAddress}</span>
                            <span className="d-block">{data.listing.propertyDetails.suburb} {data.listing.propertyDetails.state} {data.listing.propertyDetails.postcode}</span>
                            <span className="d-block">
                                <span className="icon-wrapper"><i className="icon-bed" />{data.listing.propertyDetails.bedrooms}</span>
                                <span className="icon-wrapper"><i className="icon-bath" />{data.listing.propertyDetails.bathrooms}</span>
                                <span className="icon-wrapper"><i className="icon-cab" />{data.listing.propertyDetails.carspaces}</span>
                            </span>
                            <span className="row">{closestStopsMarkup}</span>
                        </div>
                        <div className="row text-center mb-2">
                            <span className="col-12"><NewTabLink href={href} label="View" /></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchResult;