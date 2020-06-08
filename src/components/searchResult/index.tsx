import React from 'react';

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
            return <span className="mr-2" key={key}>
                <i className="icon-train" />
                {y.stop_name.replace(' Station', '')}: {Math.round(y.distance * 10) / 10}km
            </span>
        });
    
    return (
        <>
            <div className="row py-2 search-result">
                <div className="col-4 col-lg-2 pt-1">
                    <img alt={imageAltText} src={data.listing.media[0].url} width="100%" /><br />
                </div>
                <div className="col-8 col-lg-10 pl-0">
                    <span className="d-block font-weight-bold">{data.listing.priceDetails.displayPrice}</span>
                    <span className="d-block">{streetAddress}</span>
                    <span className="d-block">{data.listing.propertyDetails.suburb} {data.listing.propertyDetails.state} {data.listing.propertyDetails.postcode}</span>
                    <span className="d-block">
                        {data.listing.propertyDetails.bedrooms}<i className="icon-bed" /> 
                        {data.listing.propertyDetails.bathrooms}<i className="icon-bath" /> 
                        {data.listing.propertyDetails.carspaces}<i className="icon-cab" />
                    </span>
                    <span className="d-block">{closestStopsMarkup}</span>
                    <a className="d-block" href={href} target="_blank" rel="noopener noreferrer">View</a>
                </div>
            </div>
        </>
    );
}

export default SearchResult;