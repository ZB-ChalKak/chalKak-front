import Modal from "react-modal";
import pofileImage from "./img/프로필사진.jpg";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";

const img = pofileImage;

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
  postId: string | string[] | undefined;
  onCommentAdded?: () => void; // new prop
}

interface Comment {
  commentId: number;
  comment: string;
  nickname: string;
  profileUrl: string | null;
  createAt: string;
  updatedAt: string;
}

Modal.setAppElement(".wrap");

const CommentsModal: React.FC<ModalComponentProps> = ({ isOpen, closeModal, postId, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showFullTexts, setShowFullTexts] = useState(comments.map(() => false));
  const [commentInput, setCommentsInput] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const accessToken = Cookies.get("accessToken");

  const toggleFullText = (index: number) => {
    const newShowFullTexts = [...showFullTexts];
    newShowFullTexts[index] = !newShowFullTexts[index];
    setShowFullTexts(newShowFullTexts);
  };

  function formatDateToRelativeTime(dateString: string | number | Date) {
    // ISO 8601 형식의 날짜/시간 문자열을 Date 객체로 변환합니다.
    const date = new Date(dateString);

    // 현재 시각과의 차이를 계산하여 상대적인 시간 표현으로 변환합니다.
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }

  const loadComments = (page: number) => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `posts/${postId}/pageComments?page=${page}&size=9&sort=createdAt,desc`,
      })
        .then((response) => {
          console.log(response);
          setTotalPages(response.data.data.totalPages);
          // 기존의 comments와 새로운 comments를 합친다.
          setComments((prevComments) => [...prevComments, ...response.data.data.commentLoadResponses]);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  const handleCloseModal = () => {
    closeModal(); // 모달 창 닫기
  };

  useEffect(() => {
    loadComments(0);
  }, [postId]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommentsInput(value);
  };

  const handlePlusClick = () => {
    const newPage = page + 1;
    setPage(newPage); // + 버튼 클릭시 page 증가
    loadComments(newPage); // 바로 추가적인 댓글 로딩
  };

  const handleSubmitComment = () => {
    console.log(commentInput);
    if (postId) {
      apiInstance({
        method: "post",
        url: `posts/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          content: commentInput,
          postId: postId,
        },
      })
        .then(() => {
          // API 호출이 성공적으로 완료되었을 때 실행될 코드
          setCommentsInput(""); // 입력 필드 초기화

          // 기존 댓글 데이터 초기화
          setComments([]);

          // 새로운 댓글이 추가된 후 전체 댓글 목록 다시 로드
          loadComments(0);

          if (onCommentAdded) {
            onCommentAdded();
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Comments Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg p-10 w-[650px] h-[750px] relative overflow-y-auto "
      >
        <div className="flex w-full justify-between">
          <input
            type="text"
            placeholder="댓글을 입력해주세요."
            value={commentInput}
            onChange={(e) => handleChange(e)}
            className="input input-bordered input-md w-full mb-7 mr-2 focus:border-none rounded-full"
          />
          <button className="btn" onClick={handleSubmitComment}>
            게시
          </button>
        </div>
        {comments.map((comment, index) => (
          <div key={index} className="flex mb-5 items-center justify-between">
            <div className="flex items-start w-[600px]">
              <div className="relative w-9 h-9">
                <Image
                  src={comment.profileUrl || img}
                  alt="프로필 사진"
                  layout="fill"
                  className="rounded-full object-cover mt-[2px] items-start"
                />
              </div>
              <div>
                <div className="flex flex-col ml-2">
                  <div className="block">
                    <div className="text-sm font-semibold ml-1">{comment.nickname}</div>
                    <div
                      className={`text-sm ml-1 col w-[460px] whitespace-pre-wrap break-words ${
                        !showFullTexts[index] ? "line-clamp-2" : ""
                      }`}
                      onClick={() => toggleFullText(index)}
                    >
                      {comment.comment}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 ml-1 mt-1 text-end flex-1 w-16">
                {formatDateToRelativeTime(comment.createAt)}
              </div>
            </div>
          </div>
        ))}
        {comments.length >= 8 && totalPages > page + 1 && (
          <div className="flex justify-center mt-10">
            <AiOutlinePlusCircle className="text-4xl cursor-pointer" onClick={handlePlusClick} />
          </div>
        )}
        <button onClick={closeModal} className="absolute top-2 right-4 text-xl">
          <AiOutlineClose className="text-2xl" />
        </button>
      </Modal>
    </div>
  );
};

export default CommentsModal;
