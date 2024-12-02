import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Config } from './config';
import { handleError } from './errorHandler';

export const getHttpClient = (keyType: 'public' | 'private'): AxiosInstance => {
  const apiKey = keyType === 'public' ? Config.publicKey : Config.privateKey;
  if (!apiKey) {
    throw new Error(
      `${keyType}Key is not set. Please initialize the SDK with the required keys.`,
    );
  }

  return axios.create({
    baseURL: Config.baseURL,
    headers: {
      'x-shared-secret': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  });
};

export const makeRequest = async <T>(
  clientType: 'public' | 'private',
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const client = getHttpClient(clientType);
    const response = await client.request<T>({
      method,
      url,
      data,
      ...config, // Spread config properties into the request options
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
