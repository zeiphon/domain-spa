import React from 'react';
import NumericSearchField from '../numericSearchField';
import './search.scss';
import SuburbSearch from '../suburbSearch';

function Search(props: any) {
    const {
        state, updateState,
        suburbs, updateSuburbs,
        minBeds, updateMinBeds,
        minBaths, updateMinBaths,
        minCarSpaces, updateMinCarSpaces,
        maxPrice, updateMaxPrice,
        maxDistanceFromTrain, updateMaxDistanceFromTrain,
        runSearch
    } = props;

    return (
        <div id="search" className="p-2">
            {/* <span className="d-inline-block d-sm-none">XS</span>
            <span className="d-none d-sm-inline-block d-md-none">SM</span>
            <span className="d-none d-md-inline-block d-lg-none">MD</span>
            <span className="d-none d-lg-inline-block d-xl-none">LG</span>
            <span className="d-none d-xl-inline-block">XL</span> */}
            <div className="row mb-2">
                <div className="col-12">
                    <label htmlFor="state">State: </label>
                    <select className="state-dropdown" name="state" defaultValue={state} onChange={updateState}>
                        <option value="ACT">ACT</option>
                        <option value="NSW">NSW</option>
                        <option value="NT">NT</option>
                        <option value="QLD">QLD</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="VIC">VIC</option>
                        <option value="WA">WA</option>
                    </select>
                </div>
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

                {state === "VIC" && // TODO - Detect if the selected state has any stops
                    <NumericSearchField type="max" icon="icon-train" defaultValue={maxDistanceFromTrain} updateHandler={updateMaxDistanceFromTrain} interval={0.25} suffix=' km' />
                }
                <div className="col-sm-6 col-md-4 col-lg-3">
                    <div className="mt-2">
                        <input type="button" className="search-button px-3 rounded" value="Search" onClick={runSearch} disabled={!suburbs} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;