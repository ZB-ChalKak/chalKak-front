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

// season, weather keywords
export const seasonState = atom({
  key: 'seasonState',
  default: "",
});

export const weatherState = atom({
  key: 'weatherState',
  default: "",
});