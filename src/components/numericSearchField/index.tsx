import React from 'react';

function NumericSearchField(props: any) {
    const { label, id, defaultValue, updateHandler, interval, icon } = props;

    const decrement = function() {
        if (defaultValue - interval >= 0) {
            updateHandler(defaultValue - interval);
        }        
    }

    const increment = function() {
        updateHandler(defaultValue + interval);
    }

    return (
        <>
            <div className="row numeric-search-field mb-2">
                <div className="col-lg-4 mt-2">
                    <label className="mb-0" htmlFor={id}>{label}<i className={icon} />:</label>
                </div>
                <div className="col-lg-8 align-bottom controls mt-2">
                    <button className="down bg-light text-dark p-1 border border-secondary rounded-left d-inline-block" onClick={decrement}>-</button>
                    <span className="value px-2 py-1 border-top border-bottom border-secondary d-inline-block">{defaultValue.toLocaleString()}</span>
                    <button className="up bg-light text-dark p-1 border border-secondary rounded-right d-inline-block" onClick={increment}>+</button>
                </div>
            </div>
        </>
    );
}

export default NumericSearchField;