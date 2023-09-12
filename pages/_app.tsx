import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Navbar from "./components/Navbar";
import "../public/fonts/font.css";
import "../public/fonts/notoSansKr.css";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { styleTagsState } from "@/utils/atoms";
import { apiInstance } from "./api/api";
import InfoAlert from "./components/InfoAlert";

// import Cookies from 'js-cookie'

// 탭을 전환했다가 다시 돌아왔을 때 API 호출이 발생하지 않음
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Next.js의 페이지 컴포넌트(NextPage)와 추가적으로 getLayout이라는 선택적 함수
type PageWithLayout = NextPage & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

function StyleTagsFetcher() {
  const currentStyleTags = useRecoilValue(styleTagsState);
  const setStyleTags = useSetRecoilState(styleTagsState);
  const isEmpty = currentStyleTags[0].category === "";
  useQuery("getStyleTags", () => apiInstance.get("/styleTags").then((res) => res.data), {
    onSuccess: (data) => {
      setStyleTags(data.data.styleTags);
    },
    enabled: isEmpty,
  });
  return null;
}

//getLayouot 메소드를 가지고 있으면 사용하고, 없으면 기본 레이아웃(Navbar가 포함된 레이아웃)을 사용하도록 하는 로직
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <div className="wrap">
        <div className="container">
          <Navbar />
          {page}
        </div>
      </div>
    ));

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <StyleTagsFetcher />
        {getLayout(<Component {...pageProps} />)}
        <InfoAlert />
      </RecoilRoot>

      {/* // 개발 환경에서만 DevTools가 보이도록 설정 */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
