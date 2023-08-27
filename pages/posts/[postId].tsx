import Image from "next/image";
import profileImg from "./img/프로필사진.jpg";
import postImage from "./img/여행룩.png";

const img = profileImg;
const postImages = [postImage];

const HomePage = () => {
  return (
    <div className=" flex flex-col">
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
      <div className="w-[720px] h-[960px] mt-5 ">
        {postImages.map((image, index) => (
          <Image key={index} src={image} alt="Post Image" width={720} height={960} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
