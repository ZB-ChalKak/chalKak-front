// ImagePreview.tsx
import React, { useState, ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { uploadedImageUrlsState } from "../../utils/atoms";

const ImageUpload = () => {
  const [uploadedImageUrls, setUploadedImageUrls] = useRecoilState(uploadedImageUrlsState);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (files) {
      const imageURLs = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...imageURLs]);

      // Recoil 상태 변경
      setUploadedImageUrls([...uploadedImageUrls, ...imageURLs]);
    }

    e.target.value = "";
  };

  return (
    <div>
      <div className="flex overflow-auto p-3">
        {previews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index + 1}`} className="h-[300px] w-[230px] mr-3" />
        ))}
      </div>
      <input type="file" id="file-input" onChange={handleImageChange} accept="image/*" multiple className="hidden" />
      <label htmlFor="file-input" className="btn m-5">
        이미지 선택
      </label>
    </div>
  );
};

export default ImageUpload;
