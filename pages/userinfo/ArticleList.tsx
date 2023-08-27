import { postState } from "@/utils/atoms";
import { useRecoilValue } from "recoil";

export type Article = {
  email: string;
  content: string;
  dynamicKeyword: string[];
  staticKeyword: string[];
  seasonKeyword: string[];
  weatherKeyword: string[];
  createdAt: string;
  images: string[];
};

export default function ArticleList() {
  const postList = useRecoilValue(postState);
  const articles = postList.userPosts;
  const gridRowCount = Math.ceil(postList.length / 3);
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: gridRowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 gap-4">
            {articles
              .slice(rowIndex * 3, rowIndex * 3 + 3) // 현재 행에 해당하는 게시글 추출
              .map((post: Article, idx) => (
                <div className="w-60 h-60 object-cover" key={idx}>
                  <img src={post.images[0]} alt="post.img" />
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
