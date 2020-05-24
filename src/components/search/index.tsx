import React from 'react';

function Search(props: any) {
    const { 
        suburb, updateSuburb,
        minBeds, updateMinBeds,
        minBaths, updateMinBaths,
        minCarSpaces, updateMinCarSpaces,
        maxPrice, updateMaxPrice,
        runSearch
    } = props;

    return (
        <>
            <div id="search" className="p-2">
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="state">State:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="state" type="text" value="VIC" disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="suburb">Suburb:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="suburb" type="text" defaultValue={suburb} onChange={updateSuburb} onBlur={updateSuburb} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="minBeds">Min. bedrooms:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="minBeds" type="number" defaultValue={minBeds} onChange={updateMinBeds} onBlur={updateMinBeds} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="minBaths">Min. bathrooms:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="minBaths" type="number" defaultValue={minBaths} onChange={updateMinBaths} onBlur={updateMinBaths} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="minCarSpaces">Min. car spaces:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="minCarSpaces" type="number" defaultValue={minCarSpaces} onChange={updateMinCarSpaces} onBlur={updateMinCarSpaces} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="maxPrice">Max price:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="maxPrice" type="number" defaultValue={maxPrice} onChange={updateMaxPrice} onBlur={updateMaxPrice} />
                    </div>
                </div>

                <input type="button" value="Search" onClick={runSearch} />
            </div>
        </>
    );
}

export default Search;