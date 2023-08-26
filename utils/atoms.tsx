import { atom } from "recoil";

// file
export const uploadedImageFilesState = atom<File[]>({
  key: "uploadedImageFilesState",
  default: [],
});

// blob url
export const uploadedImageUrlsState = atom<string[]>({
  key: "uploadedImageUrlsState",
  default: [],
});

export const userState = atom({
  key: "userState",
  default: {
    email: "",
    nickname: "",
    postCount: 0,
    followers: [],
    followings: [],
    gender: "",
    height: "",
    weight: "",
    keyword: [],
  },
});
