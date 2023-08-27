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

// location
export const locationState = atom<string>({
  key: "locationState",
  default: "",
});

// season, weather keywords
export const seasonState = atom({
  key: "seasonState",
  default: "",
});

export const weatherState = atom({
  key: "weatherState",
  default: "",
});
