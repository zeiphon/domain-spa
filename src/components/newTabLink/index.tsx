import React from 'react';

function NewTabLink(props) {
    const {href, label} = props;
    return (
        <>
            <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
        </>
    );
}

export default NewTabLink;