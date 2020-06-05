import React from 'react';

function NumericSearchField(props: any) {
    const { label, id, defaultValue, updateHandler, interval } = props;

    const decrement = function() {
        updateHandler(defaultValue - interval);
    }

    const increment = function() {
        updateHandler(defaultValue + interval);
    }

    return (
        <>
            <div className="row numeric-search-field mb-2">
                <div className="col-lg-4 mt-1">
                    <label htmlFor={id}>{label}:</label>
                </div>
                <div className="col-lg-8 align-middle controls">
                    <span className="down bg-light text-dark p-1 border border-secondary rounded-left d-inline-block" onClick={decrement}>-</span>
                    <span className="value px-2 py-1 border-top border-bottom border-secondary d-inline-block">{defaultValue.toLocaleString()}</span>
                    <span className="up bg-light text-dark p-1 border border-secondary rounded-right d-inline-block" onClick={increment}>+</span>
                </div>
            </div>
        </>
    );
}

export default NumericSearchField;