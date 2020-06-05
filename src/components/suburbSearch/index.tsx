import React from 'react';
import suburbs from '../../data/suburbs';

function SuburbSearch() {
    const [results, setResults] = React.useState([""]);

    const runSuburbSearch = function(evt) {
        const value = evt.currentTarget.value;
        if (value == "") {
            setResults([""]);
            return;
        }
        const matches = suburbs.filter((x) => x.toLowerCase().startsWith(value.toLowerCase()));
        setResults(matches.slice(0, 5));
    }

    const resultsList = results.filter((x) => x != "").length > 0 
    ?
        <div className="row mb-3">
            <div className="col offset-4">
                {results.map(result => {
                    const key = `suburb-${result}`;
                    return <div key={key} className="row">
                        <div className="col-7">{result}</div>
                        <div className="col-3"><a href="#">Add</a></div>
                    </div>
                })}
            </div>
        </div>
    : 
        <></>;

    return (
        <>
            <div className="row">
                <div className="col-lg-4">
                    <label htmlFor="suburb">Suburbs:</label>
                </div>
                <div className="col-lg-8">
                    <input id="suburb" type="text" onChange={runSuburbSearch} autoComplete="off" />
                </div>
            </div>
            {resultsList}
        </>
    );
}

export default SuburbSearch;