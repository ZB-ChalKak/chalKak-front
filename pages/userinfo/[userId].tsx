// import { Post } from "@/utils/type";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { userDetailState, userPostsState } from "@/utils/atoms";
import { LiaUserCircleSolid } from "react-icons/lia";
import dynamic from "next/dynamic";

// const tempPosts: Post[] = [
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["가을"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#스트릿"],
//     dynamicKeywords: ["#테테테스트"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#테테테스트"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#엇"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#가나다라마바사"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#긴글도되나여어로로로로로롤"],
//     content: ["긴글테스트트트트트트트트트트긴글긴그ㅡ트트트트트트"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#여행"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#빈티지"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#미니멀"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#스포티"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [
//       {
//         url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
//       },
//     ],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
//   {
//     email: "seoul@test.com",
//     images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
//     seasonKeywords: ["여름"],
//     weatherKeywords: ["맑음"],
//     staticKeywords: ["#데이트"],
//     dynamicKeywords: ["#내맘대로"],
//     content: ["블라블라블라"],
//   },
// ];

export default function UserInfo(): JSX.Element {
  const [userDetail, setUserDetail] = useRecoilState(userDetailState);
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const curUserId = Cookies.get("userId");
  const router = useRouter();
  const { userId } = router.query;
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const userDetailRes = await apiInstance.get(`/users/details/${userId}`);
        setUserDetail(userDetailRes.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  // 사용자 작성 게시글 조회 api

  useEffect(() => {
    // const { userId } = router.query;
    const fetchUserPosts = async () => {
      try {
        const userPostsRes = await apiInstance.get(`/users/${userId}/posts?page=0&size=4`);
        setUserPosts(userPostsRes.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);
  console.log("userpostss", userPosts.posts);
  console.log(userDetail);
  const moveToModifyPage = () => {
    router.push(`/modify-userinfo/${userId}`);
  };
  const DynamicBtn = dynamic(() => import("../modify-userinfo/ModifyButton"), { ssr: false });
  // const gridRowCount = Math.ceil(tempPosts.length / 3);
  const { posts } = userPosts;
  const gridRowCount = Math.ceil(posts.length / 3);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col w-[550px] items-center mt-[10px]">
        <div className="flex flex-col items-center gap-6 w-[600px] h-[250px]  rounded-lg">
          <div className="flex flex-row items-center justify-around w-[480px] h-[200px] gap-10 mt-2">
            <div className="avatar">
              <div className="w-40 rounded-full">
                {userDetail.profileImg === "" && <LiaUserCircleSolid className="w-40 h-40" />}
                {userDetail.profileImg !== "" && <img src={userDetail.profileImg} alt="profile-img" />}
                {/* {userDetail.profileImg !== "" ? (
                  <LiaUserCircleSolid className="w-40 h-40" />
                ) : (
                  <img src={userDetail.profileImg} alt="profile-img" />
                )} */}
              </div>
            </div>
            <div className="flex flex-col gap-10 items-center p-5">
              <div className="flex flex-row items-center justify-center">
                <div className="text-lg font-semibold ml-3 text-black">@</div>
                {curUserId === userId && <DynamicBtn moveToModifyPage={moveToModifyPage} />}
              </div>
              <div className="flex flex-row justify-between items-center gap-10 ">
                <div className="flex flex-col items-center text-black">
                  <p>게시글</p>
                  {/* {postCount} */}
                  {userDetail.postsCount}
                </div>
                <div className="flex flex-col items-center text-black">
                  <p>팔로워</p>
                  {/* {followers.length} */}
                  {userDetail.followerCount}
                </div>
                <div className="flex flex-col items-center text-black">
                  <p>팔로잉</p>
                  {/* {following.length} */}
                  {userDetail.followingCount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[10px] pt-2 border-t-2">
          <div className="w-[500px] h-[600px]  overflow-y-auto">
            <div className="grid grid-cols-3">
              {Array.from({ length: gridRowCount }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 ml-1">
                  {posts
                    .slice(rowIndex * 3, rowIndex * 3 + 3) // 현재 행에 해당하는 게시글 추출
                    .map((post) => (
                      <div
                        className="w-40 h-40 object-cover mt-1"
                        key={post.id}
                        onClick={() => router.push(`/posts/${post.id}`)}
                      >
                        <img src={post.thumbnail} alt="post.img" className="" />
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
