import React from 'react';
import './numericSearchField.scss';

function NumericSearchField(props: any) {
    const { defaultValue, updateHandler, interval, icon, type, suffix } = props;

    const decrement = function() {
        if (defaultValue - interval >= 0) {
            updateHandler(defaultValue - interval);
        }
    }

    const increment = function() {
        updateHandler(defaultValue + interval);
    }

    let text = defaultValue.toLocaleString();
    switch (type) {
        case "min":
            text = `${text}+`;
            break;
        case "max":
            text = `<${text}`;
            break;
    }

    return (
        <div className="col-sm-6 col-md-4 col-lg-3 col-xl-12 numeric-search-field mb-2 px-3">
            <div className="align-bottom controls mt-2 px-0">
                <button className="down bg-light text-dark p-1 border border-secondary rounded-left d-inline-block" onClick={decrement}>-</button>
                <span className="value px-2 py-1 border-top border-bottom border-secondary d-inline-block"><i className={`${icon} float-left`} />{text}{suffix ?? ''}</span>
                <button className="up bg-light text-dark p-1 border border-secondary rounded-right d-inline-block" onClick={increment}>+</button>
            </div>
        </div>
    );
}

export default NumericSearchField;