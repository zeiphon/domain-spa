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
                <label htmlFor="suburb">Suburb:</label>
                <input id="suburb" type="text" defaultValue={suburb} onChange={updateSuburb} onBlur={updateSuburb} />
                <input type="button" value="Search" onClick={runSearch} />
            </div>
        </>
    );
}

export default Search;