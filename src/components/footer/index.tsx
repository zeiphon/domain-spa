import React from 'react';

function Footer() {
    return (
        <>
            <div id="footer" className="mb-2 p-2">
                <p className="mb-0">
                    &copy; <a href="https://github.com/scottabutler/" target="_blank" rel="noopener noreferrer">Scott Butler</a> 2020. This site uses API data from <a href="https://developer.domain.com.au/docs/introduction">Domain</a> and is subject to their <a href="https://developer.domain.com.au/docs/support/terms">terms of use</a>.
                </p>
                <p>
                    Fonts provided by <a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">FontAwesome</a> and bundled using <a href="http://fontello.com/" target="_blank" rel="noopener noreferrer">Fontello</a>.
                </p>
            </div>
        </>
    );
}

export default Footer;