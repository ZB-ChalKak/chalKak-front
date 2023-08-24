import { atom } from "recoil";

// export const uploadedImageFilesState = atom<File[]>({
//   key: "uploadedImageFilesState",
//   default: [],
// });

export const uploadedImageFilesState = atom<string[]>({
  key: "uploadedImageFilesState",
  default: [],
});
