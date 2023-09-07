import axios from "axios";
import Cookies from "js-cookie";

export const apiInstance = axios.create({
  baseURL: "http://ec2-13-127-154-248.ap-south-1.compute.amazonaws.com:8080/",
});

// 인터셉터 사용
apiInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
