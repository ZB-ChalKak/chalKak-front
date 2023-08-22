// HomePage.tsx
import { useRecoilState } from "recoil";
import { uploadedImageUrlsState } from "../../utils/atoms";
import ImageUpload from "./ImageUpload";
import { FormEvent, useEffect, useState } from "react";

const styleKeywordList = [
  "아메카지",
  "원마일웨어",
  "미니멀",
  "댄디",
  "비즈니스",
  "캐주얼",
  "빈티지",
  "스트릿",
  "스포티",
];
const tpoKeywordList = ["데이트", "하객", "여행", "출근"];

const seasonKeywordList = ["봄", "여름", "가을", "겨울"];

interface postingData {
  content: string;
  staticKeywords: string[];
  dynamicKeywords: string[];
  uploadedImageUrls: string[];
}

const HomePage = () => {
  const [uploadedImageUrls] = useRecoilState(uploadedImageUrlsState);
  const [staticKeywords, setStaticKeywords] = useState<string[]>([]);
  const [dynamicKeywords, setDynamicKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [dynamicKeywordInput, setDynamicKeywordInput] = useState<string>("");
  const [formData, setFormData] = useState<postingData>({
    content: "",
    dynamicKeywords: dynamicKeywords,
    staticKeywords: staticKeywords,
    uploadedImageUrls: uploadedImageUrls,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadedImageUrls: uploadedImageUrls,
    }));
  }, [uploadedImageUrls]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      staticKeywords: staticKeywords,
    }));
  }, [staticKeywords]);

  const handleDynamicKeywordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDynamicKeywordInput(e.target.value);
  };

  const handleDynamicKeywordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && dynamicKeywordInput.trim() !== "") {
      e.preventDefault();

      // 중복 키워드 확인
      if (dynamicKeywords.includes(dynamicKeywordInput.trim()) || staticKeywords.includes(dynamicKeywordInput.trim())) {
        alert("이미 있는 키워드입니다!"); // 이미 있는 키워드일 경우 alert 표시
      } else {
        setDynamicKeywords([...dynamicKeywords, dynamicKeywordInput.trim()]);
        setDynamicKeywordInput("");
      }
    }
  };

  const onKeywordCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (e.target.checked) {
      setStaticKeywords([...staticKeywords, keyword]);
    } else {
      setStaticKeywords(staticKeywords.filter((currentKeyword) => currentKeyword !== keyword));
    }
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dynamicKeywords: dynamicKeywords,
    }));
  }, [dynamicKeywords]);

  // Style Keyword Checkboxes
  const styleKeywordCheckboxes = styleKeywordList.map((keyword) => (
    <div key={keyword}>
      <input
        type="checkbox"
        id={keyword}
        value={keyword}
        onChange={onKeywordCheckboxChange}
        className="hidden peer"
        checked={staticKeywords.includes(keyword)}
      />
      <label
        htmlFor={keyword}
        className="badge badge-outline peer-checked:bg-slate-700 peer-checked:text-white p-3 m-1 text-xs whitespace-nowrap"
      >
        {keyword}
      </label>
    </div>
  ));

  // TPO Keyword Checkboxes
  const tpoKeywordCheckboxes = tpoKeywordList.map((keyword) => (
    <div key={keyword}>
      <input
        type="checkbox"
        id={keyword}
        value={keyword}
        onChange={onKeywordCheckboxChange}
        className="hidden peer"
        checked={staticKeywords.includes(keyword)}
      />
      <label
        htmlFor={keyword}
        className="badge badge-outline peer-checked:bg-slate-700 peer-checked:text-white p-3 m-1 text-xs whitespace-nowrap"
      >
        {keyword}
      </label>
    </div>
  ));

  // Season Keyword Checkboxes
  const seasonKeywordCheckboxes = seasonKeywordList.map((keyword) => (
    <div key={keyword}>
      <input
        type="checkbox"
        id={keyword}
        value={keyword}
        onChange={onKeywordCheckboxChange}
        className="hidden peer"
        checked={staticKeywords.includes(keyword)}
      />
      <label
        htmlFor={keyword}
        className="badge badge-outline peer-checked:bg-slate-700 peer-checked:text-white p-3 m-1 text-xs whitespace-nowrap"
      >
        {keyword}
      </label>
    </div>
  ));

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: content,
    }));
  }, [content]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // api 로직 수행
    console.log(formData);
  };

  return (
    <div className="w-[600px] m-auto">
      <div>
        <ImageUpload />
      </div>
      <textarea
        placeholder="내용 입력"
        className="textarea textarea-bordered textarea-sm w-full max-w-2xl my-5"
        value={content}
        onChange={handleContentChange}
      ></textarea>
      <div>
        <h2 className="mb-2">동적 키워드</h2>
        <input
          type="text"
          className="border-b border-gray-200 w-[600px] mb-5"
          placeholder="키워드를 입력하세요"
          value={dynamicKeywordInput}
          onChange={handleDynamicKeywordInput}
          onKeyUp={handleDynamicKeywordSubmit}
        />
        <input type="text" className="hidden" />
      </div>
      <div className="w-[600px] mb-5">
        <h2 className="mb-2">스타일 키워드</h2>
        <div className="flex">{styleKeywordCheckboxes}</div>
        <div className="flex">{tpoKeywordCheckboxes}</div>
      </div>
      <div>
        <h2 className="mb-2">계절 키워드</h2>
        <div className="flex mb-5">{seasonKeywordCheckboxes}</div>
      </div>
      <div className="mb-2">
        <div className="mb-2">
          {dynamicKeywords.map((keyword) => (
            <div key={keyword} className="inline-block m-1 badge badge-primary badge-outline">
              #{keyword}
            </div>
          ))}
          {staticKeywords.map((keyword) => (
            <div key={keyword} className="inline-block m-1 badge badge-secondary badge-outline">
              #{keyword}
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit} type="submit" className="btn mb-20">
        제출
      </button>
    </div>
  );
};

export default HomePage;
