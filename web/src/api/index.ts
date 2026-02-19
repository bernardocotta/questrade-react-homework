import axios from 'axios';
import type { Lottery } from './types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getLotteries = async () => {
  return await apiClient.get<Lottery[]>('/lotteries');
};

export const postLottery = async (body: {
  name: string;
  prize: string;
  type: string;
}) => {
  return await apiClient.post<Lottery>('/lotteries', body);
};

export default apiClient;
