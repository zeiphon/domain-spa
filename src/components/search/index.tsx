import React from 'react';

function Search(props: any) {
    const { 
        suburb,
        updateSuburb,
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
                        <label htmlFor="suburb">Suburb here:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="suburb" type="text" defaultValue={suburb} onChange={updateSuburb} onBlur={updateSuburb} />
                    </div>
                </div>

                <input type="button" value="Search" onClick={runSearch} />
            </div>
        </>
    );
}

export default Search;