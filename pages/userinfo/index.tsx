import { postState, userState } from "@/utils/atoms";
import { atom, useRecoilState } from "recoil";
import ArticleList, { Article } from "./ArticleList";
import { useEffect, useState } from "react";
import axios from "axios";
import { IArticle } from "@/utils/type";
import Cookies from "js-cookie";

// 유저가 작성한 게시글 정보를 가져오는 함수.
// export const getServerSideProps = async () => {
//   try {
//     const userInfo = Cookies.get("user");
//     const userInfos = JSON.parse(userInfo!);
//     const email = userInfos.email;

//     const response = await axios.post("/userPosts", {
//       email,
//     });

//     return {
//       props: {
//         userPosts: response.data,
//       },
//     };
//   } catch (error) {
//     console.log("게시글 정보를 가져오는데 실패했습니다.", error);

//     return {
//       props: {
//         userPosts: [],
//       },
//     };
//   }
// };

export default function UserInfo(): JSX.Element {
  const [userinfos, setUserInfos] = useRecoilState(userState);
  const [userPosts, setUserPosts] = useRecoilState(postState);
  const { postCount, followers, followings } = userinfos;
  console.log(userPosts);
  // localStorage에서 유저 정보 가져오기

  // 유저가 작성한 게시글 정보를 가져오는 함수.
  useEffect(() => {
    setTimeout(() => {
      async function fetchUserPost() {
        const userInfo = Cookies.get("user");
        const userInfos = JSON.parse(userInfo!);
        const email = userInfos.email;
        try {
          const response = await axios.post("/userPosts", {
            email,
          });
          setUserPosts(response.data);
        } catch (error) {
          console.log("게시글 정보를 가져오는데 실패했습니다.", error);
        }
      }
      fetchUserPost();
    }, 1000);
  }, []);

  console.log("userPosts", userPosts);
  const articles = userPosts.userPosts;
  const gridRowCount = Math.ceil(articles.length / 3);

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
          <div className="w-[500px] bg-[#c4c4c4]">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: gridRowCount }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 gap-4">
                  {articles
                    .slice(rowIndex * 3, rowIndex * 3 + 3) // 현재 행에 해당하는 게시글 추출
                    .map((post: Article, idx) => (
                      <div className="w-60 h-60 object-cover" key={idx}>
                        <img src={post.images[0].url} alt="post.img" />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
