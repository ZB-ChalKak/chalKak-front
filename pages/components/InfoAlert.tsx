import { FunctionComponent, useEffect } from "react";
import { useRecoilState } from "recoil";
import { alertState } from "@/utils/atoms";

const InfoAlert: FunctionComponent = () => {
  const [alert, setAlert] = useRecoilState(alertState);

  useEffect(() => {
    let timerId: number | null = null;

    if (alert.open) {
      timerId = setTimeout(() => {
        setAlert({ open: false, message: "" });
      }, 1500) as unknown as number;
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [alert, setAlert]);
  return (
    <div
      className={`fixed left-5 bottom-5 transition-all duration-500 ease-out transform ${
        alert.open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div
        className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 mr-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 
                    M10 .5ZM9.5 
                    a1.1h-.8v2h-.2c-.8 
                    a2H8a1 
                    Z"
          />
        </svg>
        <span className="sr-only">Info</span>
        <div>{alert.message}</div>
      </div>
    </div>
  );
};

export default InfoAlert;
