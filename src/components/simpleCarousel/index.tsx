import React from 'react';
import { useState } from 'react';

function SimpleCarousel(props: { id: string, urls: string[], altText: string }) {
    const {
        id, urls, altText
    } = props;

    const [index, setIndex] = useState(0);
    const count = urls.length-1;
    const dots = urls.map((x, i) => {
        const icon = i === index ? "circle" : "circle-empty";
        return <i key={`dot_${id}_${i}`}className={`icon-${icon}`} />
    });

    return (
        <React.Fragment key={id}>
            <div>
                <img className="w-100" src={`${urls[index]}/500x500`} alt={altText} />
                <div className="dots">
                    <span>{dots}</span>
                </div>
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