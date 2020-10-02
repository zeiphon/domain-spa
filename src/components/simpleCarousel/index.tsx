import React from 'react';
import { useState } from 'react';

function SimpleCarousel(props: { key: string, urls: string[], altText: string }) {
    const {
        key, urls, altText
    } = props;

    const [index, setIndex] = useState(0);
    const count = urls.length-1;

    return (
        <React.Fragment key={key}>
            <div>
                <img className="w-100" src={`${urls[index]}/500x500`} alt={altText} />
                {urls.length > 1 &&
                <React.Fragment>
                    <button className="back-button" onClick={() => { setIndex(index === 0 ? count : index-1) }}>
                        <i className="icon-left-open" />
                    </button>
                    <button className="next-button" onClick={() => { setIndex(index === count ? 0 : index+1) }}>
                        <i className="icon-right-open" />
                    </button>
                </React.Fragment>
                }
            </div>
        </React.Fragment>
    );
}

export default SimpleCarousel;