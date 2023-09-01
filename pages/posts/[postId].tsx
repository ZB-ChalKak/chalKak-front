import Image from "next/image";
import profileImg from "./img/프로필사진.jpg";
import postImage from "./img/여행룩.png";
import Carousel from "../components/Carousel";
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import Divider from "../components/Divider";
import { useEffect, useState } from "react";
import HeartsModal from "./HeartsModal";
import ShareModal from "./ShareModal";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CommentsSection from "./CommentSection";
import { apiInstance } from "../api/api";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import CommentsModal from "./CommentsModal";

interface Writer {
  height: number;
  id: number;
  nickname: string;
  profileImg: string;
  weight: number;
}

interface Post {
  content: string;
  hashTags: string[];
  id: number;
  likeCount: number;
  location: string;
  privacyHeight: boolean;
  privacyWeight: boolean;
  styleTags: string[];
  liked: boolean;
  following: boolean;
  viewCount: number;
  createdAt: string;
  writer: Writer;
}

const img = profileImg;
const postImages = [postImage, profileImg];

const HomePage = () => {
  const [postData, setPostData] = useState<Post | null>(null);
  const [commentsModalIsOpen, setcommentsModalIsOpen] = useState(false);
  const [heartsModalIsOpen, setHeartsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [isLike, setIsLike] = useState(postData?.liked || false);
  const [isFollow, setIsFollow] = useState(postData?.liked || false);
  const [likeCount, setLikeCount] = useState(0);
  const accessToken = Cookies.get("accessToken");

  const writerSrc = postData?.writer.profileImg || img;
  const router = useRouter();
  const { postId } = router.query;

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

  useEffect(() => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `posts/${postId}`,
      })
        .then((response) => {
          setPostData(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [postId, accessToken]);

  useEffect(() => {
    console.log(postData);
    setIsLike(postData?.liked || false);
    setIsFollow(postData?.following || false);
    setLikeCount(postData?.likeCount || 0);
  }, [postData]);

  // 좋아요 클릭
  const handleClickLike = () => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `like/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch((error) => {
        console.error("There was an error!", error);
      });
    }
    setIsLike(true);
    setLikeCount(likeCount + 1);
  };

  // 좋아요 취소 클릭
  const handleClickUnlike = () => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `like/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch((error) => {
        console.error("There was an error!", error);
      });
    }
    setIsLike(false);
    setLikeCount(likeCount - 1);
  };

  // 팔로우버튼 클릭
  const handleClickFollowBtn = () => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `follow/${postData?.writer.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch((error) => {
        console.error("There was an error!", error);
      });
    }
    setIsFollow(true);
  };

  // 언팔로우 버튼 클릭
  const handleClickUnfollowBtn = () => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `follow/${postData?.writer.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch((error) => {
        console.error("There was an error!", error);
      });
    }
    setIsFollow(false);
  };

  // 좋아요 아이콘을 보여주는 함수
  const renderLikeIcon = () => {
    if (isLike) {
      // isLike가 true일 때
      return (
        <div className="relative" onClick={handleClickUnlike}>
          <AiFillHeart className="text-4xl mr-2 cursor-pointer text-red-600" />
        </div>
      );
    } else {
      // isLike가 false일 때
      return (
        <div className="relative" onClick={handleClickLike}>
          <AiOutlineHeart className="text-4xl mr-2 cursor-pointer" />
        </div>
      );
    }
  };

  // 팔로우 버튼을 보여주는 함수
  const renderFollowButton = () => {
    if (isFollow) {
      // isFollow가 true일 때
      return (
        <button className="btn btn-neutral btn-sm h-[40px]" onClick={handleClickUnfollowBtn}>
          언팔로우
        </button>
      );
    } else {
      // isFollow가 false일 때
      return (
        <button className="btn btn-sm h-[40px]" onClick={handleClickFollowBtn}>
          팔로우
        </button>
      );
    }
  };

  function formatDateToRelativeTime(dateString: string | number | Date) {
    const date = new Date(dateString);

    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }

  return (
    <div className=" flex flex-col mt-6">
      <div className=" flex items-center w-[680px] mx-auto">
        <div className="flex items-center">
          <div className="relative w-12 h-12">
            <Image src={writerSrc} alt="프로필 사진" layout="fill" className="rounded-full object-cover" />
          </div>
          <div className="ml-3">
            <div className="flex">
              <div className=" font-semibold">{postData?.writer.nickname}</div>
              <div className="ml-3">
                {postData?.privacyHeight && (
                  <div className="flex items-center">
                    <div className="border w-[90px] text-center py-[2px] mt-[1.6px] rounded-full bg-slate-100 text-[10px] text-gray-500">
                      {postData?.writer.height}cm · {postData?.writer.weight}kg
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              {postData?.location && <div className="text-[12px]">{postData?.location}</div>}
            </div>
          </div>
        </div>

        <div className="w-[80px] text-center ml-auto"> {renderFollowButton()}</div>
      </div>
      <Carousel
        settings={{ slidesToShow: 1, speed: 300, arrows: true, dots: true, centerMode: false, infinite: false }}
      >
        {postImages.map((image, index) => (
          <div key={index} className="w-[720px] h-[960px] bg-gray-300 flex items-center justify-center mt-4">
            <Image src={image} alt={`Post Image ${index}`} className="object-cover w-full h-full" />
          </div>
        ))}
      </Carousel>
      <div className="flex items-center justify-between w-[680px] mx-auto mt-1-">
        <div className="flex flex-1">
          {renderLikeIcon()}
          <div onClick={openCommentsModal} className="relative cursor-pointer">
            <AiOutlineComment className="text-4xl" />
          </div>
          <CommentsModal isOpen={commentsModalIsOpen} closeModal={closeCommentsModal} postId={postId} />
        </div>
        <div onClick={openShareModal} className=" w-7 h-7 cursor-pointer relative">
          <BiLinkExternal className="text-3xl cursor-pointer" />
        </div>
        <ShareModal isOpen={shareModalIsOpen} closeModal={closeShareModal} />
      </div>
      <div>
        <div className="w-[120px]" onClick={openHeartsModal}>
          <div className="flex ml-5 mt-2 cursor-pointer">
            좋아요 <div className="font-bold ml-1">{likeCount}</div>개
          </div>
          <div className="mt-5 ml-5 w-[660px] text-lg">{postData?.content}</div>
          <div className="flex ml-5 mt-2 cursor-pointer w-[600px] text-gray-500">
            {postData?.styleTags.map((tag, index) => (
              <div className="mr-1" key={index}>
                #{tag}
              </div>
            ))}

            {postData?.hashTags.map((tag, index) => (
              <div className="mr-1" key={index}>
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      <HeartsModal isOpen={heartsModalIsOpen} closeModal={closeHeartsModal} />
      <div className=" mb-36">
        <CommentsSection postId={postId} />
        <div className="text-xs text-gray-400 ml-7 mt-[-10px]">
          {postData?.createdAt ? formatDateToRelativeTime(postData.createdAt) : ""}
        </div>
        <Divider width="200px" />
      </div>
    </div>
  );
};

export default HomePage;
