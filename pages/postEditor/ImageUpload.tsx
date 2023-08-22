import React, { useState, ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { uploadedImageFilesState } from "../../utils/atoms";

const ImageUpload = () => {
  const [uploadedImageFiles, setUploadedImageFiles] = useRecoilState(uploadedImageFilesState);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      const imageURLs = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...imageURLs]);

      // Recoil 상태 업데이트
      setUploadedImageFiles([...uploadedImageFiles, ...fileArray]);
    }

    e.target.value = "";
  };

  return (
    <div>
      <div className="flex overflow-auto">
        {previews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index + 1}`} className="h-[300px] w-[230px] mr-3" />
        ))}
        <input type="file" id="file-input" onChange={handleImageChange} accept="image/*" multiple className="hidden" />
        <label htmlFor="file-input" className="btn h-[300px] w-[230px]  ">
          <p className=" text-5xl font-light">+</p>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
