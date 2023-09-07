import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Cookies from "js-cookie";
import { apiInstance } from "../api/api";
type FollowingModalProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
  userId: number;
};
// /follow/{userId}/pageFollower
// 팔로워 리스트 받아오기
// export const getServerSideProps = async() => {
//   const userId = Cookies.get("userId");
//   let followingList;
//   try {
//     const response = await apiInstance.get(`/follow/${userId}/pageFollower`);
//     followingList = response.data;
//   } catch (error) {
//     console.error(error);
//     return { notFound: true };
//   }
//   return { props: { followingList } };
// }

const FollowingModal = ({ isOpen, handleCloseModal }: FollowingModalProps) => {
  const [followingList, setFollowingList] = useState([]);
  const userId = Cookies.get("userId");
  useEffect(() => {
    // http://ec2-13-127-154-248.ap-south-1.compute.amazonaws.com:8080/follow/{memberId}/pageFollowing?page=0&size=10&sort=id,desc
    // api 호출하여 팔로잉 리스트 받아오기
    const response = apiInstance.get(`/follow/${userId}/pageFollowing`);
    response.then((res) => {
      setFollowingList(res.data.data);
    });
  }, []);

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div>팔로잉 리스트</div>
          {followingList.map((following, index) => {})}
          <button onClick={handleCloseModal}>닫기</button>
        </ModalWrapper>
      )}
    </>
  );
};

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: fixed;
  width: 600px;
  min-width: 600px;
  max-height: 90vh;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -40%);
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;
