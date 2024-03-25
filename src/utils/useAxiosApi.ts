import axios, { AxiosRequestConfig } from 'axios';
import Toast from "quarkd/lib/toast";

// create an axios instance
const instance = axios.create({
  withCredentials: false,
  timeout: 100000,
  baseURL: '/api'
});

// request interceptor
instance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // const token = store.state.user.token;

    // if (token) {
    //   // let each request carry token
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`
    //   };
    // }
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  },
);

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 10000) {
      Toast.text(res.message);
      // 412: Token expired;
      if (res.code === 412) {
        // store.dispatch('user/userLogout');
      }
      return Promise.reject(res.message || 'Error');
    } else {
      return res.result;
    }
  },
  (error) => {
    Toast.text(error.message);
    return Promise.reject(error.message);
  },
);

/**
 * reactive useFetchApi
 */

export default instance;
