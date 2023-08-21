import React, { ReactNode } from "react";
import Slider, { Settings } from "react-slick";

interface CarouselProps {
    settings?: Settings;
    children: ReactNode;
}

const Carousel:React.FC<CarouselProps> = ({ settings, children }) => {
    const defaultSettings: Settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
    };

   // 사용자 정의 설정이 있으면 기본 설정에 병합
    const finalSettings = settings ? { ...defaultSettings, ...settings } : defaultSettings;

    return (
        <div className="container mx-auto">
            <Slider {...finalSettings}>
                {children}
            </Slider>
        </div>
    );
};

export default Carousel;