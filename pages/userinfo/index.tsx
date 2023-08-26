import { userState } from "@/utils/atoms";
import { atom, useRecoilState } from "recoil";
import ArticleList from "./ArticleList";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserInfo() {
  const [userinfo, setUserInfo] = useRecoilState(userState);
  const [userPosts, setUserPosts] = useState([]);
  const { postCount, followers, followings } = userinfo;
  const users = localStorage.getItem("users");
  const { email } = users;

  // 유저가 작성한 게시글 정보를 가져오는 함수.
  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const response = await axios.get("/userPosts", {
          params: {
            email: email,
          },
        });
        setUserPosts(response.data);
      } catch (error) {
        console.log("게시글 정보를 가져오는데 실패했습니다.", error);
      }
    };

    fetchUserPost();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-[550px] items-center mt-[10px]">
        <div className="flex flex-row items-center gap-10 w-[500px] h-[250px] bg-[#c4c4c4]">
          <div className="avatar ml-8">
            <div className="w-48 rounded-full">
              <img src="/images/카카오.jpg" alt="profile.img" />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center">
              <p>게시글</p>
              {postCount}
            </div>
            <div className="flex flex-col items-center">
              <p>팔로워</p>
              {followers.length}
            </div>
            <div className="flex flex-col items-center">
              <p>팔로잉</p>
              {followings.length}
            </div>
          </div>
        </div>
        <div className="mt-[10px]">
          <div className="w-[500px] bg-[#c4c4c4]">{/* <ArticleList props={userPosts} /> */}</div>
        </div>
      </div>
    </div>
  );
}
