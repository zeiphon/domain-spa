import React from 'react';
import NewTabLink from '../newTabLink'

function Footer() {
    return (
        <>
            <div id="footer" className="text-center mb-2 p-2">
                <p className="mb-0">
                    &copy; 2022 <NewTabLink href="https://github.com/scottabutler/" label="Scott Butler" />. This site uses API data from <NewTabLink href="https://developer.domain.com.au/docs/introduction" label="Domain" /> and is subject to their <NewTabLink href="https://developer.domain.com.au/docs/support/terms" label="terms of use" />.
                </p>
                <p className="mb-0">
                    Agency logos and colours are supplied by Domain and remain the property of their respective agency.
                </p>
                <p className="mb-2">
                    Your search filters and hidden properties are saved in local storage and do not leave your computer.
                </p>
                <p className="mb-0">
                    Typeahead component provided by <NewTabLink href="https://ericgio.github.io/react-bootstrap-typeahead/" label="React Bootstrap Typeahead" />.
                </p>
                <p className="mb-0">
                    Icons provided by <NewTabLink href="https://fontawesome.com/" label="FontAwesome" /> and bundled using <NewTabLink href="http://fontello.com/" label="Fontello" />.
                </p>
                <p className="mb-0">
                    Suburb list provided by <NewTabLink href="https://github.com/michalsn/australian-suburbs" label="michalsn/australian-suburbs" />.
                </p>
            </div>
        </>
    );
}

export default Footer;