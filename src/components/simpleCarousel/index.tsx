import React from 'react';
import { useState } from 'react';
import './simpleCarousel.scss';

function SimpleCarousel(props: { id: string, urls: string[], altText: string }) {
    const {
        id, urls, altText
    } = props;

    const [index, setIndex] = useState(0);
    const count = urls.length;
    const previousIndex = getPreviousIndex(index, count);
    const nextIndex = getNextIndex(index, count)
    const dots = urls.map((x, i) => {
        const icon = i === index ? "circle" : "circle-empty";
        return <i key={`dot_${id}_${i}`}className={`icon-${icon}`} />
    });
    const imgStyle = urls[index]
    ? {
        backgroundImage: `url('${urls[index]}')`,
    }
    : {};

    /* Preload adjacent images to prevent flicker on scroll */
    const previousImage = <img src={urls[previousIndex]} style={{display: "none"}} alt="Previous carousel" />
    const nextImage = <img src={urls[nextIndex]} style={{display: "none"}} alt="Next carousel" />

    return (
        <div className="wrapper" key={id}>
            {previousImage}{nextImage}
            <div className="img" style={imgStyle} title={altText} />
            <div className="dots">
                <span>{dots}</span>
            </div>
            {urls.length > 1 &&
            <React.Fragment>
                <button className="back-button" onClick={() => { setIndex(previousIndex) }}>
                    <i className="icon-left-open" />
                </button>
                <button className="next-button" onClick={() => { setIndex(nextIndex) }}>
                    <i className="icon-right-open" />
                </button>
            </React.Fragment>
            }
        </div>
    );
}

export default SimpleCarousel;

function getPreviousIndex(current: number, count: number) {
    return current === 0 ? count-1 : current-1;
}
function getNextIndex(current: number, count: number) {
    return current === count-1 ? 0 : current+1;
}