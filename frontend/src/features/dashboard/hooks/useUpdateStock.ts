import {

    useMutation,

    useQueryClient

} from "@tanstack/react-query";

import { updatePortfolioStock } from "../services/portfolioService";

export function useUpdateStock() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({

            id,

            data

        }: {

            id: number;

            data: any;

        }) => updatePortfolioStock(id, data),

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