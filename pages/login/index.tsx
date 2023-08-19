import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/router";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// 이메일과 비밀번호를 포함한 객체
interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false); // 로그인 실패 알림
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    // 로그인 API 호출
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
  
    const { email, password } = formData;
    try {
      const response = await axios.post("/signin", {
        email,
        password,
      });
      console.log(response);
  
      if (response.status === 200) {
        router.push("/");
      } else {
        setLoginFailed(true);
      }
    } catch (error) {
      setLoginFailed(true);
    }
  }

  // 구글 로그인
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      router.push('/');
    } catch (error) {
      console.log('message');
    }
  };

  // 이메일 양식 확인
  const checkEmailFormat = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleChangeValid = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (checkEmailFormat(value)) {
        setInvalidEmail(false);
      } else {
        setInvalidEmail(true);
      }
    }
  };

  // 이메일 및 비밀번호 입력 여부 확인
  function isLoginFormValid() {
    return checkEmailFormat(formData.email) && formData.password.length > 0;
  }

  // 버튼 활성화 결정
  function getButtonActive() {
    return isLoginFormValid()
      ? "btn-neutral bg-[rgb(43,52,64)] w-full py-3 font-medium rounded-full text-md"
      : "btn w-full py-3 font-medium rounded-full bg-gray-200 text-md";
  }
  
  // 알림창 렌더링
  interface AlertProps {
    loginFailed: boolean; 
    setLoginFailed: (state: boolean) => void; 
  }

  const Alert: FunctionComponent<AlertProps> = ({
    loginFailed,
    setLoginFailed,
  }) => {
    if (!loginFailed) return null;

    useEffect(() => {
      let timerId: number | null = null; //timerId 변수를 정의하며 초기값은 null로 설정 나중에 setTimeout 함수에서 반환되는 값을 저장

      if (loginFailed) {
        timerId = setTimeout(() => {
          setLoginFailed(false);
        }, 3000) as unknown as number;
      }
      // 클린업 함수 컴포넌트가 언마운트 될 때 호출되거나 useEffect 다시 실행되기 전에 호출, timerId 값이 존재할 경우 clearTimeout 함수를 사용해 타이머를 취소하고 초기화
      return () => {
        if (timerId) {
          clearTimeout(timerId); 
        }
      };
    }, [loginFailed]); 

    return (
      <div className="flex items-center justify-center bg-white ml-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span className="font-medium text-center text-xs p-2">이메일 또는 비밀번호를 확인해주세요.</span>
        <button onClick={() => setLoginFailed(false)} className="ml-4 focus:outline-none">
          &times;
        </button>
      </div>
    );
  }

  return (
    <>
      <Alert loginFailed={loginFailed} setLoginFailed={setLoginFailed} />
      <div className="w-full flex flex-col items-center justify-center bg-white">
        <div className="p-6">
          <h2 className="text-2xl font-medium mt-3 pl-4 text-center leading-9 text-gray-800">로그인</h2>
        </div>

        <div className="mt-[60px] mx-4 w-[500px] h-[600px]">
          <form>
            <div>
              <label htmlFor="email" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                이메일 주소
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleChangeValid(e);
                    handleChange(e);
                  }}
                  placeholder="zero@zerobase.com"
                  autoComplete="off"
                  className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                />
                {invalidEmail && <p className="text-red-500 text-xs mt-1">이메일 양식이 잘못되었습니다.</p>}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block mt-[40px] pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                비밀번호
              </label>
              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                />
              </div>
            </div>
            <div className="mt-[60px]">
              <button type="submit" onClick={handleLogin} disabled={!isLoginFormValid()} className={getButtonActive()}>
                로그인
              </button>
            </div>
          </form>

          <ul className="flex justify-evenly items-center mt-[40px] ml-[10px]">
            <li className="list-none">
              <Link href={"/signup"} className="text-center text-sm text-gray-700">
                회원가입
              </Link>
            </li>
            <li className="list-none">
              <span className="text-gray-200 text-xs mx-1">|</span>
            </li>
            <li className="list-none">
              <Link href={"/signup"} className="text-center text-sm pl-[10px] text-gray-700">
                아이디 찾기
              </Link>
            </li>
            <li className="list-none">
              <span className="text-gray-200 text-xs mx-1">|</span>
            </li>
            <li className="list-none">
              <Link href={"/signup"} className="text-center text-sm text-gray-700">
                비밀번호 찾기
              </Link>
            </li>
          </ul>

          <div className="mt-[80px] flex items-center">
            <hr className="flex-grow border-t border-gray-100 mr-[20px]" />
            <p className="text-gray-700 text-xs pr-[24px]">Or sign in with</p>
            <hr className="flex-grow border-t border-gray-100" />
          </div>

          <div className="mt-[50px] ml-[210px] background-white border rounded-full w-[70px] h-[70px] flex items-center justify-center cursor-pointer">
            <FcGoogle 
              className="w-[34px] h-[34px]"
              onClick={handleGoogleLogin} />
          </div>
        </div>
      </div>
    </>
  );
}
