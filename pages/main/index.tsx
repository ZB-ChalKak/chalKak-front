import React, { useState } from 'react';
import { AiOutlineBars } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import Carousel from '../components/Carousel';

interface Keyword {
    title: string;
}

const keywords: Keyword[] = [
    {
        title: "전체",
    },
    {
        title: "체형",
    },
    {
        title: "#여름코디",
    },
    {
        title: "#데이트룩",
    },
    {
        title: "#스트릿패션",
    },
];

// 날씨 기반 스타일 추천 캐러셀
const CarouselContent: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
    <div className="bg-white flex flex-direction-row cursor-pointer overflow-hidden">
        <img src={imageUrl} alt="sample" className="w-[400px] h-[580px] max-w-full max-h-full" />
    </div>
);

const sampleImages = [
    {image: "https://i.pinimg.com/originals/eb/5e/2e/eb5e2e287820dd4d1e5f1d8efc4a0f35.jpg"},
    {image: "https://i.pinimg.com/originals/8d/f7/22/8df722763542969f9804aa41fb06b802.jpg"},
    {image: "https://i.pinimg.com/originals/8d/f7/22/8df722763542969f9804aa41fb06b802.jpg"},
];

const Main = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    // 키워드 모달  
    const modal = () => {
        return (
            <div className="fixed z-40 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50">
                <div className="bg-white container mx-auto min-h-screen relative">
                    <h2 className="text-center text-xl font-bold mt-4 border-b pb-4">필터</h2>
                    <GrClose 
                        className="absolute top-5 left-4 text-xl cursor-pointer"
                        onClick={closeModal}>
                    </GrClose>
                    <div className="flex flex-wrap justify-center gap-4 mt-16">
                        {keywords.map((keyword) => (
                            <div key={keyword.title} className="bg-white text-black py-2 px-5 border rounded-full">
                                <p>{keyword.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mt-[16px] container mx-auto">
                <div className="mt-10 text-xl pl-6">오늘 날씨와 어울리는 스타일</div>
                <div className="mt-6 pl-6">
                    <Carousel>
                        {sampleImages.map((image, index) => (
                            <CarouselContent key={index} imageUrl={image.image} />
                        ))}
                    </Carousel>
                </div>


                <div className="text-2xl pl-6">키워드 추천</div>
                <div className="mt-10">
                    <div className="ml-10 flex flex-wrap justify-flex-start gap-4">
                        <div className="bg-white text-black py-[6px] px-5 border rounded-full flex items-center cursor-pointer">
                            <AiOutlineBars 
                                className="w-[24px] h-[24px] cursor-pointer" 
                                onClick={showModal} />
                        </div>
                        {keywords.map((keyword) => (
                            <div 
                                key={keyword.title} 
                                className="bg-white text-black py-[7px] px-5 border rounded-full cursor-pointer text-sm">
                                <p>{keyword.title}</p>
                            </div>
                        ))}
                    </div>
                    {isModalVisible && modal()}
                </div>
            </div>
        </div>
    );
};

export default Main;