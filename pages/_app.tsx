import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "./components/Navbar";
import "../public/fonts/font.css";
import "../public/fonts/notoSansKr.css";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  if (process.env.NODE_ENV === "development") {
    if (typeof window === "undefined") {
      (async () => {
        const { server } = await import("../mocks/server");
        server.listen();
      })();
    } else {
      (async () => {
        const { worker } = await import("../mocks/browser");
        worker.start();
      })();
    }
  }
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <div className="wrap">
          <div className="container">
            <Navbar />
            <Component {...pageProps} />
          </div>
        </div>
      </RecoilRoot>

      {/* // 개발 환경에서만 DevTools가 보이도록 설정 */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
