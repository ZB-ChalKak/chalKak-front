// HomePage.tsx
import { useRecoilState } from "recoil";
import axios from "axios";
import { uploadedImageFilesState } from "../../utils/atoms";
import ImageUpload from "./ImageUpload";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import KeywordCheckbox from "./KeywordCheckbox";
import KeywordRadioButton from "./KeywordRadioButton";

const keywordList = {
  style: ["아메카지", "원마일웨어", "미니멀", "댄디", "비즈니스", "캐주얼", "빈티지", "스트릿", "스포티"],
  tpo: ["데이트", "하객", "여행", "출근"],
  season: ["봄", "여름", "가을", "겨울"],
  weather: ["맑음", "흐림", "비", "눈"],
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!isSubmitting) {
      setDynamicKeywordInput(e.target.value);
    }
  };

  const handleDynamicKeywordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setIsSubmitting(true);

      // 중복 키워드 확인
      if (dynamicKeywords.includes(dynamicKeywordInput.trim()) || staticKeywords.includes(dynamicKeywordInput.trim())) {
        alert("이미 있는 키워드입니다!");
      } else {
        setDynamicKeywords([...dynamicKeywords, dynamicKeywordInput.trim()]);
        setDynamicKeywordInput("");
      }

      setIsSubmitting(false);
    }
  };

  const onKeywordCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;
    let _keywords = [...staticKeywords];

    if (isChecked) {
      // 이전 계절 키워드를 제거한 후 새로운 계절 키워드 추가
      _keywords = _keywords.filter((k) => !keywordList.season.includes(k));
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

  // 스타일키워드
  const styleKeywordCheckboxes = keywordList.style.map((keyword) => (
    <KeywordCheckbox
      key={keyword}
      keyword={keyword}
      isChecked={staticKeywords.includes(keyword)}
      onChange={onKeywordCheckboxChange}
    />
  ));
  // tpo키워드
  const tpoKeywordCheckboxes = keywordList.tpo.map((keyword) => (
    <KeywordCheckbox
      key={keyword}
      keyword={keyword}
      isChecked={staticKeywords.includes(keyword)}
      onChange={onKeywordCheckboxChange}
    />
  ));

  // 계절 키워드
  const seasonKeywordCheckboxes = keywordList.season.map((keyword) => (
    <KeywordRadioButton
      key={keyword}
      name={"season"}
      keyword={keyword}
      isChecked={seasonKeywords.includes(keyword)}
      onChange={onSeasonKeywordRadioButtonChange}
    />
  ));

  // 날씨 키워드
  const weatherKeywordCheckboxes = keywordList.weather.map((keyword) => (
    <KeywordRadioButton
      key={keyword}
      name={"weather"}
      keyword={keyword}
      isChecked={weatherKeywords.includes(keyword)}
      onChange={onWeatherKeywordRadioButtonChange}
    />
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

    // uploadedImageFiles.forEach((file, index) => {
    //   submissionFormData.append(`image-${index}`, file);
    // });

    uploadedImageFiles.forEach((file, index) => {
      submissionFormData.append(`image-${index}`, file);
    });

    submissionFormData.append("content", content);
    submissionFormData.append("staticKeywords", staticKeywords.join(","));
    submissionFormData.append("dynamicKeywords", dynamicKeywords.join(","));
    submissionFormData.append("seasonKeyword", seasonKeywords.join(","));
    submissionFormData.append("weatherKeyword", weatherKeywords.join(","));

    try {
      await axios.post("/postEditor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(error);
    }
    console.dir(1, Object.entries(submissionFormData));
    console.log(2, formData);
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
          onKeyDown={handleDynamicKeywordSubmit}
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
