import axios from "axios";
import Cookies from "js-cookie";
// export const apiInstance = axios.create({
//   baseURL: "http://ec2-13-127-154-248.ap-south-1.compute.amazonaws.com:8080/",
// });
export const apiInstance = axios.create({
  baseURL: "http://ec2-13-127-154-248.ap-south-1.compute.amazonaws.com:8080/",
});
// Add a request interceptor
apiInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);
