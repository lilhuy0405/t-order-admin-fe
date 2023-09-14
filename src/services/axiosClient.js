import axios from 'axios';
import queryString from 'query-string';
import { API_URL, TORDER_PROFILE } from '../constants';
import { getLocalStorageObject } from '../utils/web-utils';

//TODO: handle logic for intercept jwt token and refresh token when it expired
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json'
  },
  // paramsSerializer: {
  //   encode: (params) => {
  //     console.log(params);
  //     console.log(queryString.stringify(params));
  //     return queryString.stringify(params);
  //   }
  // }
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  const profile = getLocalStorageObject(TORDER_PROFILE);
  if (profile) {
    const token = profile.accessToken;
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosClient.interceptors.response.use((response) => {
  if (response && response.data && response.data.data) {
    return response.data.data;
  }

  if (response && response.data) {
    return response.data;
  }

  return response;
}, (error) => {
  // Handle errors
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw error;
});
export default axiosClient;
