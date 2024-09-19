import React, {useRef, useState} from 'react';
import styles from "@/components/searchList/searchList.module.scss";
import Slider from "react-slick";

const SampleNextArrow = ({ handler, disabled }) => {
    return (
        <div className={`${styles.customNextArrow} ${disabled && styles.disabledArrow}`} onClick={handler}/>
    )
};

const SamplePrevArrow = ({onClick, disabled}) => (
    <div className={`${styles.customPrevArrow} ${disabled && styles.disabledArrow}`} onClick={onClick} />
);

const SearchSlider = ({render, dataLength, fetchData}) => {
    const sliderRef = useRef(null);
    const slidesToShow = 6;
    const slidesToScroll = 3;
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNextClick = () => {
        console.log('after :',currentSlide + slidesToShow, dataLength - slidesToShow)
        if (currentSlide + slidesToShow >= dataLength - slidesToShow) {
            fetchData();
            sliderRef.current.slickNext();
        } else {
            sliderRef.current.slickNext();
        }
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow,
        slidesToScroll,
        lazyLoad: true,
        nextArrow: <SampleNextArrow handler={handleNextClick} />,
        prevArrow: <SamplePrevArrow />,
        afterChange: (current) => setCurrentSlide(current),
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <Slider ref={sliderRef} {...settings}>
            {render}
        </Slider>
    );
}

export default SearchSlider;