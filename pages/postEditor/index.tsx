// HomePage.tsx
import { useRecoilState } from "recoil";
import axios from "axios";
import { uploadedImageFilesState } from "../../utils/atoms";
import ImageUpload from "./ImageUpload";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

const weatherKeywordList = ["맑음", "흐림", "비", "눈"];

interface postingData {
  content: string;
  staticKeywords: string[];
  dynamicKeywords: string[];
  seasonKeywords: string[];
  weatherKeywords: string[];
  uploadedImageFiles: File[];
}

const HomePage = () => {
  const [uploadedImageFiles] = useRecoilState(uploadedImageFilesState);
  const [staticKeywords, setStaticKeywords] = useState<string[]>([]);
  const [dynamicKeywords, setDynamicKeywords] = useState<string[]>([]);
  const [seasonKeywords, setSeasonKeywords] = useState<string[]>([]);
  const [weatherKeywords, setWeatherKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [dynamicKeywordInput, setDynamicKeywordInput] = useState<string>("");
  const [formData, setFormData] = useState<postingData>({
    content: "",
    dynamicKeywords: dynamicKeywords,
    staticKeywords: staticKeywords,
    uploadedImageFiles: uploadedImageFiles,
    seasonKeywords: seasonKeywords,
    weatherKeywords: weatherKeywords,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadedImageFiles,
      staticKeywords,
      dynamicKeywords,
      weatherKeywords,
      seasonKeywords,
    }));
  }, [uploadedImageFiles, staticKeywords, dynamicKeywords, weatherKeywords, seasonKeywords]);

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

  const onKeywordCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;
    let _keywords = [...staticKeywords];

    if (isChecked) {
      // 이전 계절 키워드를 제거한 후 새로운 계절 키워드 추가
      _keywords = _keywords.filter((k) => !seasonKeywordList.includes(k));
      _keywords.push(keyword);
    } else {
      // 현재 계절 키워드 제거
      _keywords.splice(_keywords.indexOf(keyword), 1);
    }

    setStaticKeywords(_keywords);
  };

  // 게절 체인지
  const onSeasonKeywordRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSeasonKeywords([keyword]);
    } else {
      setSeasonKeywords(seasonKeywords.filter((seasonKeyword) => seasonKeyword !== keyword));
    }
  };

  // 날씨 체인지
  const onWeatherKeywordRadioButtonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setWeatherKeywords([keyword]);
    } else {
      setWeatherKeywords(weatherKeywords.filter((weatherKeyword) => weatherKeyword !== keyword));
    }
  };

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
        type="radio" // 체크박스에서 라디오 버튼으로 변경
        id={keyword}
        value={keyword}
        name="season" // 동일한 이름을 사용해서 라디오 그룹 생성
        onChange={onSeasonKeywordRadioButtonChange}
        className="hidden peer"
        checked={seasonKeywords.includes(keyword)}
      />
      <label
        htmlFor={keyword}
        className="badge badge-outline peer-checked:bg-slate-700 peer-checked:text-white p-3 m-1 text-xs whitespace-nowrap"
      >
        {keyword}
      </label>
    </div>
  ));

  // Weather Keyword Checkboxes
  const weatherKeywordCheckboxes = weatherKeywordList.map((keyword) => (
    <div key={keyword}>
      <input
        type="radio" // 체크박스에서 라디오 버튼으로 변경
        id={keyword}
        value={keyword}
        name="weather" // 동일한 이름을 사용해서 라디오 그룹 생성
        onChange={onWeatherKeywordRadioButtonChange}
        className="hidden peer"
        checked={weatherKeywords.includes(keyword)}
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submissionFormData = new FormData();

    // 이미지 파일을 formData에 추가
    uploadedImageFiles.forEach((file, index) => {
      submissionFormData.append(`image-${index}`, file);
    });

    // content, staticKeywords, dynamicKeywords 데이터를 formData에 추가
    submissionFormData.append("content", content);
    submissionFormData.append("staticKeywords", staticKeywords.join(","));
    submissionFormData.append("dynamicKeywords", dynamicKeywords.join(","));

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post("/your-api-endpoint", submissionFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 서버로부터 반환된 데이터를 처리하는 로직
    } catch (error) {
      console.error(error);
    }

    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-[600px] m-auto" encType="multipart/form-data">
      <div className="mb-5">
        <ImageUpload />
      </div>
      <textarea
        placeholder="내용 입력"
        className="textarea textarea-bordered textarea-sm resize-none w-full max-w-2xl my-5"
        value={content}
        onChange={handleContentChange}
      ></textarea>
      <div className="mb-5">
        {dynamicKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1 text-violet-400 ">
            #{keyword}
          </div>
        ))}
        {staticKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1">
            #{keyword}
          </div>
        ))}
        {seasonKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1">
            #{keyword}
          </div>
        ))}
        {weatherKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1">
            #{keyword}
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-2">TAG</h2>
        <input
          type="text"
          className="border-b border-gray-200 w-[600px] mb-7 py-2"
          placeholder="키워드를 입력하세요"
          value={dynamicKeywordInput}
          onChange={handleDynamicKeywordInput}
          onKeyUp={handleDynamicKeywordSubmit}
        />
        <input type="text" className="hidden" />
      </div>
      <div className="w-[600px] mb-5">
        <h2 className="mb-2">STYLE</h2>
        <div className="w-[600px] mb-5">
          <div className="flex">{styleKeywordCheckboxes}</div>
          <div className="flex">{tpoKeywordCheckboxes}</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="mb-2">SEASON*</h2>
        <div className="flex ">{seasonKeywordCheckboxes}</div>
      </div>
      <div>
        <h2 className="mb-2">WEATHER*</h2>
        <div className="flex ">{weatherKeywordCheckboxes}</div>
      </div>
      <button type="submit" className="btn-neutral w-[600px] p-3 rounded-full text-sm my-10">
        제출
      </button>
    </form>
  );
};

export default HomePage;
