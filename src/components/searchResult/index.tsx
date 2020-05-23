import React from 'react';

function SearchResult(props: any) {
    const { 
        data
    } = props;

    const href = `https://domain.com.au/${data.listing.listingSlug}`;

    return (
        <>
            <div className="searchResult p-2">
                <span>Advertiser: {data.listing.advertiser.name}</span><br />
                <span>Agents: {data.listing.advertiser.contacts.map(x => x.name).join()}</span><br />
                <span>Address: {data.listing.propertyDetails.displayableAddress}</span><br />
                <img src={data.listing.media[0].url} width="50" height="50" /><br />
                <a href={href} target="_blank">View</a>
            </div>
        </>
    );
}

export default SearchResult;