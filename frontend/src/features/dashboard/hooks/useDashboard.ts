import { useQuery } from "@tanstack/react-query";

import {
    getDashboard,
    getDashboardSummary
} from "../services/dashboardService";

// =============================================================================
// Summary Hook
// =============================================================================

export function useDashboardSummary() {

    return useQuery({

        queryKey: ["dashboard-summary"],

        queryFn: getDashboardSummary,

    });

}

// =============================================================================
// Complete Dashboard Hook
// =============================================================================

export function useDashboard() {

    return useQuery({

        queryKey: ["dashboard"],

        queryFn: getDashboard,

    });

}