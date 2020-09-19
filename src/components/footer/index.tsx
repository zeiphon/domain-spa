import React from 'react';
import NewTabLink from '../newTabLink'

function Footer() {
    return (
        <>
            <div id="footer" className="mb-2 p-2">
                <p className="mb-0">
                    &copy; 2020 <NewTabLink href="https://github.com/scottabutler/" label="Scott Butler" />. This site uses API data from <NewTabLink href="https://developer.domain.com.au/docs/introduction" label="Domain" /> and is subject to their <NewTabLink href="https://developer.domain.com.au/docs/support/terms" label="terms of use" />.
                </p>
                <p>
                    Icons provided by <NewTabLink href="https://fontawesome.com/" label="FontAwesome" /> and bundled using <NewTabLink href="http://fontello.com/" label="Fontello" />. Image carousel provided by <NewTabLink href="https://www.npmjs.com/package/pure-react-carousel" label="Pure React Carousel" />.
                </p>
            </div>
        </>
    );
}

export default Footer;