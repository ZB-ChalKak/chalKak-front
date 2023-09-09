import { useEffect } from "react";
import { apiInstance } from "../api/api";
import { useRecoilState } from "recoil";
import { followingPostsState } from "@/utils/atoms";
import Cookies from "js-cookie";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";

const Following = () => {
  const [followingPosts, setFollowingPosts] = useRecoilState(followingPostsState);
  console.log("followingPosts", followingPosts);
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
  const handleClickLike = (postId: number, likeCount: number, liked: boolean) => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = followingPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeCount: likeCount + 1,
                liked: !liked,
              };
            }
            return post;
          });
          setFollowingPosts(updatePosts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleClickUnlike = (postId: number, likeCount: number, liked: boolean) => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = followingPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeCount: likeCount - 1,
                liked: !liked,
              };
            }
            return post;
          });
          setFollowingPosts(updatePosts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      try {
        const followingPostsRes = await apiInstance.get("/filter/following");
        // 팔로우한 사람들이 작성한 게시글을 업데이트
        setFollowingPosts(followingPostsRes.data.data.posts);
      } catch (error) {
        alert("조회에 실패하였습니다." + error);
      }
    };
    fetchFollowingPosts();
  }, [accessToken]);
  const postsLength = followingPosts.length;
  const firstCols = followingPosts.slice(0, postsLength / 2);
  const secondCols = followingPosts.slice(postsLength / 2, postsLength);
  console.log("firstCols", firstCols);
  console.log("secondCols", secondCols);
  return (
    <div className="w-full h-full bg-white">
      <div className="mx-auto">
        <div className="flex items-center justify-start border-b pb-2">
          <button className="mr-4 text-lg ml-6">추천</button>
          <button className="text-lg text-white bg-black rounded">팔로잉</button>
        </div>
        <div style={{ columnCount: 2, columnGap: "1rem", padding: "0 1rem" }} className="mt-4">
          {followingPosts.map((post) => (
            <div style={{ breakInside: "avoid", margin: "auto" }} key={post.id}>
              <div className="flex flex-col items-center justify-center">
                <img
                  src={post.thumbnail}
                  alt="post-img"
                  style={{ objectFit: "cover", height: "100%" }}
                  className="rounded-lg"
                  onClick={() => router.push(`/posts/${post.id}`)}
                />
                <div className="flex flex-row items-center justify-between w-full gap-1 mb-2 mt-2 ml-4">
                  <div className="flex flex-row items-center justify-start">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img src={post.writer.profileImg} alt="profile-img" />
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-slate-700">{post.writer.nickname}</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center mr-4">
                    {post.liked === false && (
                      <div className="relative" onClick={() => handleClickLike(post.id, post.likeCount, post.liked)}>
                        <AiOutlineHeart className="mr-1 cursor-pointer text-red-500" />
                      </div>
                    )}
                    {post.liked === true && (
                      <div className="relative" onClick={() => handleClickUnlike(post.id, post.likeCount, post.liked)}>
                        <AiFillHeart className="mr-1 cursor-pointer text-red-500" />
                      </div>
                    )}
                    {post.likeCount}
                  </div>
                </div>
                <div className="flex flex-col justify-start mb-10 w-[20rem]">
                  <div>{post.content}</div>
                  <div className="items-start mt-2">
                    {post.hashTags.map((tag) => (
                      <div key={tag} className="text-xs float-left mr-1">
                        #{tag}
                      </div>
                    ))}
                    {post.styleTags.map((tag) => (
                      <div key={tag} className="text-xs float-left mr-1">
                        #{tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Following;

// .text-2xl {
//   font-size: 1.5rem/* 24px */;
//   line-height: 2rem/* 32px */;
// }

{
  /* <div className="mt-5 h-auto grid grid-cols-2 gap-4 px-4 grid-auto-rows: 1fr">
  {followingPosts.map((post) => (
    <div className="grid gap-4" key={post.id}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-start w-full gap-4 mb-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src={post.writer.profileImg} alt="profile-img" />
            </div>
          </div>
          <div>
            <p className="text-xs">{post.writer.nickname}</p>
          </div>
        </div>
        <img src={post.thumbnail} alt="post-img" style={{ objectFit: "cover", height: "100%" }} />
        <div>{post.content}</div>
        <div>#{post.hashTags}</div>
        <div>#{post.styleTags}</div>
      </div>
    </div>
  ))}
</div>; */
}
