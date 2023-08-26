import React, { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import Weather from '../components/Weather';
import { useRecoilValue } from 'recoil';
import { seasonState, weatherState } from '@/utils/atoms';
import axios from 'axios';

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
        <img src={imageUrl} alt="sample" className="pl-4"/>
    </div>
);

interface Post {
    image: string;
}

const Main = () => {
    const seasonKeywords = useRecoilValue(seasonState);
    const weatherKeywords = useRecoilValue(weatherState);

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        axios.get(`/posts`, {
            params: {
                seasonKeywords: seasonKeywords,
                weatherKeywords: weatherKeywords
            }
        })
        .then((response) => {
            setPosts(response.data.posts);
        })
        .catch((error) => {
            console.error("게시글을 불러오는데 실패하였습니다.", error);
        });
    }, [seasonKeywords, weatherKeywords]);

    return (
        <div className="w-full h-full bg-white">
            <div className="max-auto">
                <div className="mt-6 ml-6 text-m text-gray-400"><Weather /></div>
                <div className="mt-8 text-xl ml-6 font-bold">오늘 날씨와 어울리는 스타일</div>
                <div className="mt-6 ml-4">
                    <Carousel>
                    {posts.map((post, index) => (
                        <CarouselContent key={index} imageUrl={post.image} />
                    ))}
                    </Carousel>
                </div>
    
                <div className="mt-12">
                    <div className="text-xl ml-6 font-bold">키워드 추천</div>
                    <div className="mt-6">
                        <div className="ml-6 flex flex-wrap justify-flex-start gap-4">
                            
                            {keywords.map((keyword) => (
                            <div
                                key={keyword.title}
                                className="bg-white text-black py-[4px] px-4 border rounded-full cursor-pointer text-xs"
                                >
                                <p>{keyword.title}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;