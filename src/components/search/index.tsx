import React from 'react';
import NumericSearchField from '../numericSearchField';
import './search.scss';
import SuburbSearch from '../suburbSearch';

function Search(props: any) {
    const {
        suburbs, updateSuburbs,
        minBeds, updateMinBeds,
        minBaths, updateMinBaths,
        minCarSpaces, updateMinCarSpaces,
        maxPrice, updateMaxPrice,
        maxDistanceFromTrain, updateMaxDistanceFromTrain,
        runSearch
    } = props;

    return (
        <>
            <div id="search" className="p-2">
                {/* <span className="d-inline-block d-sm-none">XS</span>
                <span className="d-none d-sm-inline-block d-md-none">SM</span>
                <span className="d-none d-md-inline-block d-lg-none">MD</span>
                <span className="d-none d-lg-inline-block d-xl-none">LG</span>
                <span className="d-none d-xl-inline-block">XL</span> */}
                <div className="row mb-2">
                    <div className="col-12">
                        <label htmlFor="state">State: Victoria</label>
                    </div>
                    {/* <div className="col">
                        <input id="state" type="text" value="VIC" disabled />
                    </div> */}
                </div>

                <div className="row">
                    <div className="col-8 col-sm-6 col-md-6 col-lg-4">
                        <textarea id="suburb" className="border-secondary" rows={1} placeholder="Suburb(s) e.g Kew, Rye" defaultValue={suburbs} onChange={updateSuburbs} onBlur={updateSuburbs} />
                    </div>
                </div>
                <div className="row">
                    <NumericSearchField type="min" icon="icon-bed" defaultValue={minBeds} updateHandler={updateMinBeds} interval={1} />
                    <NumericSearchField type="min" icon="icon-bath" defaultValue={minBaths} updateHandler={updateMinBaths} interval={1} />
                    <NumericSearchField type="min" icon="icon-cab" defaultValue={minCarSpaces} updateHandler={updateMinCarSpaces} interval={1} />
                    <NumericSearchField type="max" icon="icon-dollar" defaultValue={maxPrice} updateHandler={updateMaxPrice} interval={10000} />
                    <NumericSearchField type="max" icon="icon-train" defaultValue={maxDistanceFromTrain} updateHandler={updateMaxDistanceFromTrain} interval={0.25} suffix=' km' />

                    <div className="col-sm-6, col-md-2">
                        <div className="mt-2">
                            <input type="button" className="search-button" value="Search" onClick={runSearch} disabled={!suburbs} />
                        </div>
                    </div>

                </div>


            </div>
        </>
    );
}

export default Search;