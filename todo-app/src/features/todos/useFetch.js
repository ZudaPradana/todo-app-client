import { axiosProducts } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useFetchProduct = () => {
  //using react query / tanstack query
  return useQuery({
    //akses semua response dari react query
    //data, isLoading is output from useQuery
    queryFn: async () => {
      const productsResponse = await axiosProducts.get("todos");
      return productsResponse.data.data;
    },
  });
};
