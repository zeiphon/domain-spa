import React from 'react';

function Search(props: any) {
    const { suburb, updateSuburb } = props;
    return (
        <>
            <div>Search fields</div>
            <input type="text" defaultValue={suburb} onChange={updateSuburb} />
        </>
    );
}

export default Search;