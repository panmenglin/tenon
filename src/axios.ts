import axios from 'axios';
import { AxiosRequestConfig, AxiosInstance } from 'axios/index.d';
import localForage from 'localforage';

declare module 'axios/index.d' {
  export interface AxiosRequestConfig {
    fileType?: string;
  }
}

// @ts-ignore
const axiosInstance = axios.create({
});

axiosInstance.interceptors.request.use(
  (req: any) => {
    return req;
  },
  (error: any) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res: any) => {
    function updateLocal() {
      if (res.config?.url && res.data) {
        localForage.setItem(res.config.url, res.data)
      }
    }

    requestIdleCallback(updateLocal)

    return res;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

export default async function (config: AxiosRequestConfig): Promise<any> {
  const local = config?.url ? await localForage.getItem(config.url) : undefined;

  if (local) {
    axiosInstance(config).catch(function (res: any) {
      return res;
    })

    return {
      config,
      data: local
    }
  }

  return axiosInstance(config).catch(function (res: any) {
    return res;
  });
}
