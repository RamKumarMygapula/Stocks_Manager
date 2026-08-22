import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import {
    deletePortfolioStock
} from "../services/portfolioService";

export function useDeleteStock() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: number) =>
            deletePortfolioStock(id),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["portfolio"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard-summary"]
            });

        }

    });

}