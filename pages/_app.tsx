import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Navbar from "./components/Navbar";
import "../public/fonts/font.css";
import "../public/fonts/notoSansKr.css";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

// Next.js의 페이지 컴포넌트(NextPage)와 추가적으로 getLayout이라는 선택적 함수
type PageWithLayout = NextPage & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

//getLayouot 메소드를 가지고 있으면 사용하고, 없으면 기본 레이아웃(Navbar가 포함된 레이아웃)을 사용하도록 하는 로직
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => (
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
        {getLayout(<Component {...pageProps} />)}
      </RecoilRoot>

      {/* // 개발 환경에서만 DevTools가 보이도록 설정 */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
