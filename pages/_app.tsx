import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "./components/Navbar";
import "../public/fonts/font.css";
import "../public/fonts/notoSansKr.css";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { styleTagsState } from "@/utils/atoms";
import { apiInstance } from "./api/api";
import InfoAlert from "./components/InfoAlert";

const queryClient = new QueryClient();

function StyleTagsFetcher() {
  const currentStyleTags = useRecoilValue(styleTagsState);
  // const shouldFetch = !currentStyleTags || currentStyleTags.category === "";
  // console.log(shouldFetch);
  const setStyleTags = useSetRecoilState(styleTagsState);
  useQuery("getStyleTags", () => apiInstance.get("/styleTags").then((res) => res.data), {
    onSuccess: (data) => {
      setStyleTags(data.data.styleTags);
    },
  });
  console.log(currentStyleTags);
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <StyleTagsFetcher />
        <div className="wrap">
          <div className="container">
            <Navbar />
            <Component {...pageProps} />
          </div>
        </div>
        <InfoAlert />
      </RecoilRoot>

      {/* // 개발 환경에서만 DevTools가 보이도록 설정 */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
