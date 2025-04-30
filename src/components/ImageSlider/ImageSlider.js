import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import './ImageSlider.css';

const ImageSlider = () => {

    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderRef.current) {
                sliderRef.current.slickNext();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <div className="slick-arrow slick-prev" style={{ color: 'red' }}></div>,
        nextArrow: <div className="slick-arrow slick-next" style={{ color: 'blue' }}></div>,
    };

    const images = [
        '/assets/images/demn.jpg',
        '/assets/images/image2.jpg',
    ];

    return (
        <Slider ref={sliderRef} {...settings} className="image-slider">
            {images.map((image, index) => (
                <div key={index} className='slider-image-container'>
                    <img src={image} alt={`Slide ${index + 1}`} className='slider-image' />
                </div>
            ))}
        </Slider>
    );
};

export default ImageSlider;