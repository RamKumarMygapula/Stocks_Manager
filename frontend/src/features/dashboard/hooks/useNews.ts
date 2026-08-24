import { useQuery } from "@tanstack/react-query";

import { fetchNews } from "../services/newsService";

export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });
};