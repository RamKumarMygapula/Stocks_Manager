import {

    useMutation,

    useQueryClient

} from "@tanstack/react-query";

import { addPortfolioStock } from "../services/portfolioService";

export function useAddStock() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: addPortfolioStock,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["portfolio"]

            });

            queryClient.invalidateQueries({

                queryKey: ["dashboard-summary"]

            });

            queryClient.invalidateQueries({

                queryKey: ["dashboard"]

            });

        }

    });

}