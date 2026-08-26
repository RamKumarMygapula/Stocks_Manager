import axios from "axios";

import type { NewsResponse } from "../types/news";

const API_BASE_URL = "http://localhost:8000";

export const fetchNews = async (): Promise<NewsResponse> => {
  const response = await axios.get<NewsResponse>(
    `${API_BASE_URL}/news`
  );

  return response.data;
};