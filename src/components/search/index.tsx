import React from 'react';

function Search(props) {
    const { suburb } = props;
    return (
        <>
            <div>Search fields</div>
            <input type="text" value={suburb} />
        </>
    );
}

export default Search;