import Modal from "react-modal";
import pofileImage from "./img/프로필사진.jpg";
import Image from "next/image";
import { useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
}

const CommentsModal: React.FC<ModalComponentProps> = ({ isOpen, closeModal }) => {
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

  const comments = [
    {
      url: pofileImage,
      name: "eunseok",
      content:
        "하하ggggggggggggggggggggggggggg하하ggggdddddddddddddddddddddddddddgkgkgkgdddddddggggggggggggggdddddddddddddddkggkgkgkgkgkgkgkgkgkgkgkgkgk",
      day: "1일 전",
    },
    {
      url: pofileImage,
      name: "sohyun",
      content: "호호",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "jongjin",
      content: "히히",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "eunseok",
      content: "하하ggggggggggggggggggggggggggg하하...",
      day: "15일 전",
    },
    {
      url: pofileImage,
      name: "sohyun",
      content: "호호",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "jongjin",
      content: "히히",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "sohyun",
      content: "호호",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "jongjin",
      content: "히히",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "jongjin",
      content: "히히",
      day: "2일 전",
    },
    {
      url: pofileImage,
      name: "jongjin",
      content: "히히",
      day: "2일 전",
    },
  ];

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Comments Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg p-10 w-[650px] h-[750px] relative overflow-y-auto "
      >
        <div className="flex w-full justify-between">
          <input
            type="text"
            placeholder="댓글을 입력해주세요."
            className="input input-bordered input-md w-full mb-7 mr-2 focus:border-none rounded-full"
          />
          <button className="btn">게시</button>
        </div>
        {comments.map((comment, index) => (
          <div key={index} className="flex mb-5 items-center justify-between">
            <div className="flex items-start w-[600px]">
              <div className="relative w-9 h-9">
                <Image
                  src={comment.url}
                  alt="프로필 사진"
                  layout="fill"
                  className="rounded-full object-cover mt-[2px] items-start"
                />
              </div>
              <div>
                <div className="flex flex-col ml-2">
                  <div className="block">
                    <div className="text-sm font-semibold ml-1">{comment.name}</div>
                    <div className="text-sm ml-1 col w-[460px] whitespace-pre-wrap break-words">{comment.content}</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 ml-1 mt-1 text-end flex-1">{comment.day}</div>
            </div>
          </div>
        ))}
        {comments.length >= 8 && (
          <div className="flex justify-center">
            <AiOutlinePlusCircle className="text-4xl cursor-pointer" />
          </div>
        )}
        <button onClick={closeModal} className="absolute top-2 right-4 text-xl">
          X
        </button>
      </Modal>
    </div>
  );
};

export default CommentsModal;
