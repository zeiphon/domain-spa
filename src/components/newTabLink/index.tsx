import React from 'react';

function NewTabLink(props) {
    const {href, label, className} = props;
    return (
        <>
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>
        </>
    );
}

export default NewTabLink;