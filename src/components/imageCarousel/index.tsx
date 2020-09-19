import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import "pure-react-carousel/dist/react-carousel.es.css";

function ImageCarousel(props: { urls: string[] }) {
    const {
        urls
    } = props;

    return (
        <CarouselProvider
            naturalSlideWidth={1}
            naturalSlideHeight={1}
            totalSlides={urls.length}
            infinite={true}
            touchEnabled={true}
        >
            <Slider className="slider">
                {urls.map((x, i) =>
                    <Slide index={i}>
                        <Image hasMasterSpinner={false} src={x} />
                    </Slide>
                )}
            </Slider>
            <ButtonBack className="back-button"><i className="icon-left-open" /></ButtonBack>
            <ButtonNext className="next-button"><i className="icon-right-open" /></ButtonNext>
        </CarouselProvider>
    );
}

export default ImageCarousel;