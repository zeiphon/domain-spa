import React from 'react';

function NumericSearchField(props: any) {
    const { label, id, defaultValue, updateHandler } = props;

    return (
        <>
            <div className="row">
                <div className="col-lg-4">
                    <label htmlFor={id}>{label}:</label>
                </div>
                <div className="col-lg-8">
                    <input id={id} type="number" defaultValue={defaultValue} 
                        onChange={updateHandler} onBlur={updateHandler} 
                    />
                </div>
            </div>
        </>
    );
}

export default NumericSearchField;