import React from 'react';

function NewTabLink(props) {
    const {href, label, className, children} = props;

    const content = children ? children : label;

    return (
        <>
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
        </>
    );
}

export default NewTabLink;