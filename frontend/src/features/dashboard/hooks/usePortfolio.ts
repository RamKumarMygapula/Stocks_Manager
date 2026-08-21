import { useQuery } from "@tanstack/react-query";

import { getPortfolio } from "../services/portfolioService";

// =============================================================================
// Portfolio Query
// =============================================================================

export function usePortfolio() {

    return useQuery({

        queryKey: ["portfolio"],

        queryFn: getPortfolio,

    });

}