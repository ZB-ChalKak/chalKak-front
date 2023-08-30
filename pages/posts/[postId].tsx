import Image from "next/image";
import profileImg from "./img/프로필사진.jpg";
import postImage from "./img/여행룩.png";
import Carousel from "../components/Carousel";
import { AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { accessTokenState } from "@/utils/atoms";
import { BiLinkExternal } from "react-icons/bi";
import Divider from "../components/Divider";
import CommentsModal from "./CommentsModal";
import { useState } from "react";
import HeartsModal from "./HeartsModal";
import ShareModal from "./ShareModal";
import { useRecoilValue } from "recoil";
import Cookies from "js-cookie";

const img = profileImg;
const postImages = [postImage, profileImg];
const heartCount = 96;
const commentsCount = 6;

const comments = [
  {
    name: "eunseok",
    content: "하하ggggggggggggggggggggggggggggg하하ggggggggggggggggggggggggggggg하하ggggggggggggggggggggggggggggg",
    day: "1일 전",
  },
  {
    name: "sohyun",
    content: "호호",
    day: "2일 전",
  },
  {
    name: "jongjin",
    content: "히히",
    day: "2일 전",
  },
];

const HomePage = () => {
  const [commentsModalIsOpen, setcommentsModalIsOpen] = useState(false);
  const [heartsModalIsOpen, setHeartsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);

  console.log(accessToken);
  console.log(Cookies.get("userId"));

  const openCommentsModal = () => {
    setcommentsModalIsOpen(true);
  };

  const closeCommentsModal = () => {
    setcommentsModalIsOpen(false);
  };

  const openHeartsModal = () => {
    setHeartsModalIsOpen(true);
  };

  const closeHeartsModal = () => {
    setHeartsModalIsOpen(false);
  };

  const openShareModal = () => {
    setShareModalIsOpen(true);
  };

  const closeShareModal = () => {
    setShareModalIsOpen(false);
  };

  return (
    <div className=" flex flex-col mt-6">
      <div className=" flex items-center justify-between w-[680px] mx-auto">
        <div className="flex">
          <div className="relative w-12 h-12">
            <Image src={img} alt="프로필 사진" layout="fill" className="rounded-full object-cover" />
          </div>
          <div className="ml-2">
            <div className=" font-semibold">name</div>
            <div className="text-gray-500">날짜</div>
          </div>
        </div>
        <div>
          <div className="btn">팔로우</div>
        </div>
      </div>
      <Carousel settings={{ slidesToShow: 1, arrows: true, dots: true, centerMode: false, infinite: false }}>
        {postImages.map((image, index) => (
          <div key={index} className="w-[720px] h-[960px] bg-gray-300 flex items-center justify-center mt-4">
            <Image src={image} alt={`Post Image ${index}`} className="object-cover w-full h-full" />
          </div>
        ))}
      </Carousel>
      <div className="flex items-center justify-between w-[680px] mx-auto mt-1-">
        <div className="flex flex-1">
          <div>
            <AiOutlineHeart className="text-4xl mr-2 cursor-pointer" />
          </div>
          <div onClick={openCommentsModal} className="relative cursor-pointer">
            <AiOutlineComment className="text-4xl" />
          </div>
        </div>
        <div onClick={openShareModal} className=" w-7 h-7 cursor-pointer relative">
          <BiLinkExternal className="text-3xl cursor-pointer" />
        </div>
        <ShareModal isOpen={shareModalIsOpen} closeModal={closeShareModal} />
      </div>
      <div>
        <div className="w-[120px]" onClick={openHeartsModal}>
          <div className="flex ml-5 mt-2 cursor-pointer">
            좋아요 <div className="font-bold ml-1">{heartCount}</div>개
          </div>
        </div>
      </div>
      <HeartsModal isOpen={heartsModalIsOpen} closeModal={closeHeartsModal} />
      <div className="mb-4 w-24">
        <div className="mt-3 ml-5 mb-4 flex cursor-pointer" onClick={openCommentsModal}>
          댓글
          <div className="font-bold ml-1">{commentsCount}</div>개
        </div>
        <CommentsModal isOpen={commentsModalIsOpen} closeModal={closeCommentsModal} />

        <div className="flex w-[680px] mx-auto ml-5">
          <div className="flex flex-col">
            {comments.map((comment, index) => (
              <div key={index} className="flex w-[680px] mb-4 justify-between">
                <div className="flex items-center">
                  <div className="relative w-9 h-9">
                    <Image src={img} alt="프로필 사진" layout="fill" className="rounded-full object-cover mt-[2px]" />
                  </div>
                  <div>
                    <div className="flex flex-col ml-2">
                      <div className="flex">
                        <div className="text-sm font-semibold ml-1">{comment.name}</div>
                        <div className="text-sm ml-2 col w-96 overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {comment.content}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-1 mt-1">{comment.day}</div>
                    </div>
                  </div>
                </div>
                <AiOutlineHeart className="text-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" mb-36">
        <Divider width="200px" />
      </div>
    </div>
  );
};

export default HomePage;
