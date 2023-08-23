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
        <img src={imageUrl} alt="sample" className="" />
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
        <div className="w-full h-full bg-white">
            <div className="max-auto">
                <div className="mt-6 ml-6 text-m text-gray-400">현재 날씨 🌤️ </div>
                <div className="mt-8 text-xl ml-6 font-bold">오늘 날씨와 어울리는 스타일</div>
                <div className="mt-6 ml-4">
                    <Carousel>
                    {sampleImages.map((image, index) => (
                        <CarouselContent key={index} imageUrl={image.image} />
                    ))}
                    </Carousel>
                </div>
    
                <div className="mt-12">
                    <div className="text-xl ml-6 font-bold">키워드 추천</div>
                    <div className="mt-6">
                        <div className="ml-6 flex flex-wrap justify-flex-start gap-4">
                            <div className="bg-white text-black py-[4px] px-3 border rounded-full flex items-center cursor-pointer">
                                <AiOutlineBars
                                className="w-[16px] h-[16px] cursor-pointer"
                                onClick={showModal}
                                />
                            </div>
                            {keywords.map((keyword) => (
                            <div
                                key={keyword.title}
                                className="bg-white text-black py-[4px] px-4 border rounded-full cursor-pointer text-xs"
                                >
                                <p>{keyword.title}</p>
                            </div>
                        ))}
                        </div>
                        {isModalVisible && modal()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;