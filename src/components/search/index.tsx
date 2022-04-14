import React from 'react';
import { State } from '../../types/domain';
import NumericSearchField from '../numericSearchField';
import SuburbSearch from '../suburbSearch';
import './search.scss';
import { Option } from '../../data/allSuburbOptions';
// import SuburbSearch from '../suburbSearch';

interface SearchProps {
    state: State;
    updateState: any;

    suburbs: string;
    updateSuburbs: (suburbs: string) => void;
    suburbOptions: Option[];

    minBeds: number;
    updateMinBeds: (minBeds: number) => void;

    minBaths: number;
    updateMinBaths: (minBaths: number) => void;

    minCarSpaces: number;
    updateMinCarSpaces: (minCarSpaces: number) => void;

    maxPrice: number;
    updateMaxPrice: (maxPrice: number) => void;

    maxDistanceFromTrain: number;
    updateMaxDistanceFromTrain: (maxDistanceFromTrain: number) => void;

    runSearch: any
}

function Search(props: SearchProps) {
    const {
        state, updateState,
        suburbs, updateSuburbs,
        suburbOptions,
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
                <div className="col-12 px-3">
                    <span className="state-radios">
                        {["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map(x => {
                            const labelClass = `border border-secondary text-center me-2 mb-2 px-2 py-1 ${state === x ? 'selected' : ''}`;
                            return <React.Fragment key={`state_radio_${x}`}>
                                <input
                                    type="radio"
                                    name="state"
                                    id={`state_${x}`}
                                    value={x}
                                    checked={state === x}
                                    onChange={updateState}
                                />
                                <label htmlFor={`state_${x}`} className={labelClass}>
                                    {x}
                                </label>
                            </React.Fragment>
                        })
                        }
                    </span>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4 mx-1 mb-2">
                    <SuburbSearch suburbs={suburbs} updateSuburbs={updateSuburbs} state={state} suburbOptions={suburbOptions} />
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
                <div className="col-sm-6 col-md-4 col-lg-3 px-3">
                    <div className="mt-2">
                        <input type="button" className="search-button px-3 rounded mb-1" value="Search" onClick={runSearch} disabled={!suburbs} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;