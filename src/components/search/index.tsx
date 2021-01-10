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
                <div className="row mb-2">
                    <div className="col-12">
                        <label htmlFor="state">State: Victoria</label>
                    </div>
                    {/* <div className="col">
                        <input id="state" type="text" value="VIC" disabled />
                    </div> */}
                </div>

                <div className="row">
                    <div className="col-12 mb-1">
                        <label htmlFor="suburb">Suburb(s):</label>
                    </div>
                    <div className="col">
                        <textarea id="suburb" rows={1} placeholder="e.g Kew, Rye" defaultValue={suburbs} onChange={updateSuburbs} onBlur={updateSuburbs} />
                    </div>
                </div>
                <NumericSearchField type="min" icon="icon-bed" defaultValue={minBeds} updateHandler={updateMinBeds} interval={1} />
                <NumericSearchField type="min" icon="icon-bath" defaultValue={minBaths} updateHandler={updateMinBaths} interval={1} />
                <NumericSearchField type="min" icon="icon-cab" defaultValue={minCarSpaces} updateHandler={updateMinCarSpaces} interval={1} />
                <NumericSearchField type="max" icon="icon-dollar" defaultValue={maxPrice} updateHandler={updateMaxPrice} interval={10000} />
                <NumericSearchField type="max" icon="icon-train" defaultValue={maxDistanceFromTrain} updateHandler={updateMaxDistanceFromTrain} interval={0.25} />

                <div className="row">
                    <div className="offset-lg-4 col-lg-8 mt-2">
                        <input type="button" value="Search" onClick={runSearch} disabled={!suburbs} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;