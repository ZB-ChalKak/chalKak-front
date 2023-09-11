// import { Post } from "@/utils/type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { followerListState, followingListState, userDetailState, userPostsState } from "@/utils/atoms";
import { LiaUserCircleSolid } from "react-icons/lia";
import dynamic from "next/dynamic";
import FollowerModal from "./FollowerModal";
import FollowingModal from "./FollowingModal";
import { useInfiniteQuery } from "react-query";
import { userPostsType } from "@/utils/type";

export default function UserInfo(): JSX.Element {
  const [userDetail, setUserDetail] = useRecoilState(userDetailState);
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const [followers, setFollowers] = useRecoilState(followerListState);
  const [following, setFollowing] = useRecoilState(followingListState);
  const [isOpenFollowerModal, setIsOpenFollowerModal] = useState<boolean>(false);
  const [isOpenFollowingModal, setIsOpenFollowingModal] = useState<boolean>(false);
  const curUserId = Cookies.get("userId");
  const router = useRouter();
  const { userId } = router.query;
  console.log("following", following);
  console.log("followers", followers);
  // 사용자 정보 조회 api (프로필 이미지, 게시글 수, 팔로워 수, 팔로잉 수)
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
  // useEffect(() => {
  //   // const { userId } = router.query;
  //   const fetchUserPosts = async () => {
  //     try {
  //       const userPostsRes = await apiInstance.get(`/users/${userId}/posts?page=0&size=12`);
  //       setUserPosts(userPostsRes.data.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   if (userId) {
  //     fetchUserPosts();
  //   }
  // }, [userId]);
  const fetchUserPosts = async ({ pageParam = 0 }) => {
    try {
      const userPostsRes = await apiInstance.get(`/users/${userId}/posts?page=${pageParam}&size=12`);
      return userPostsRes.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: userPostsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery("userPosts", fetchUserPosts, {
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

  useEffect(() => {
    if (userPostsData) {
      const allPages: userPostsType[] = userPostsData.pages.flatMap((page) => page.posts);
      setUserPosts((prev) => ({
        ...prev,
        posts: allPages,
      }));
    }
  }, [userPostsData]);

  // followerList 조회 api
  useEffect(() => {
    const fetchFollowerList = async () => {
      try {
        const followerListRes = await apiInstance.get(`/follow/${userId}/pageFollower`);
        setFollowers(followerListRes.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      fetchFollowerList();
    }
  }, [userId]);

  // followingList 조회 api
  useEffect(() => {
    const fetchFollowingList = async () => {
      try {
        const followingListRes = await apiInstance.get(`/follow/${userId}/pageFollowing`);
        setFollowing(followingListRes.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      fetchFollowingList();
    }
  }, [userId]);

  // follower 모달 handler
  const openFollowerModal = () => {
    setIsOpenFollowerModal(true);
  };
  const closeFollowerModal = () => {
    setIsOpenFollowerModal(false);
  };

  // following 모달 handler
  const openFollowingModal = () => {
    setIsOpenFollowingModal(true);
  };
  const closeFollowingModal = () => {
    setIsOpenFollowingModal(false);
  };

  console.log("userpostss", userPosts.posts);
  console.log(userDetail);
  const moveToModifyPage = () => {
    router.push(`/modify-userinfo/${userId}`);
  };
  const DynamicBtn = dynamic(() => import("../modify-userinfo/ModifyButton"), { ssr: false });
  // const gridRowCount = Math.ceil(tempPosts.length / 3);
  // const { posts } = userPosts;
  // const gridRowCount = Math.ceil(posts.length / 3);
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex flex-col w-full items-center mt-[10px]">
        <div className="flex flex-col items-center gap-6 w-full h-[250px]  rounded-lg">
          <div className="flex flex-row items-center justify-around w-auto h-[200px] gap-10 mt-2">
            <div className="avatar">
              <div className="w-32 rounded-full">
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
                <div className="text-lg font-semibold ml-3 text-black">@{userDetail.nickname}</div>
                {curUserId === userId && <DynamicBtn moveToModifyPage={moveToModifyPage} />}
              </div>
              <div className="flex flex-row justify-between items-center gap-10 ">
                <div className="flex flex-col items-center text-sm text-black">
                  <p>게시글</p>
                  {/* {postCount} */}
                  {userDetail.postsCount}
                </div>
                <div className="flex flex-col items-center text-sm text-black" onClick={openFollowerModal}>
                  <p>팔로워</p>
                  {/* {followers.length} */}
                  {userDetail.followerCount}
                </div>
                {isOpenFollowerModal && (
                  <FollowerModal
                    initialFollowerData={followers}
                    isOpen={isOpenFollowerModal}
                    handleCloseModal={closeFollowerModal}
                  />
                )}
                <div className="flex flex-col items-center text-sm text-black" onClick={openFollowingModal}>
                  <p>팔로잉</p>
                  {/* {following.length} */}
                  {userDetail.followingCount}
                </div>
                {isOpenFollowingModal && (
                  <FollowingModal
                    initialFollowingData={following}
                    isOpen={isOpenFollowingModal}
                    handleCloseModal={closeFollowingModal}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[10px] pt-2 border-t-2">
          <div className="w-3/4 h-[600px] overflow-y-auto mx-auto">
            {/* {Array.from({ length: gridRowCount }).map((_, rowIndex) => (
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
              ))} */}
            <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4">
              {/* {posts.map((post) => (
                <div key={post.id} className="w-40 h-40" onClick={() => router.push(`/posts/${post.id}`)}>
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={post.thumbnail}
                      alt="post.img"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              ))} */}
              {userPosts.posts.map((post) => (
                <div
                  key={post.id}
                  className="w-40 h-40 object-cover mt-4"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={post.thumbnail}
                      alt="post.img"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded disabled:bg-gray-300"
              >
                {isFetchingNextPage ? "로딩 중..." : "더 불러오기"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
