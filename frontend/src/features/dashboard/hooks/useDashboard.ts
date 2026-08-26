import { useQuery } from "@tanstack/react-query";

import {
    getDashboard,
    getDashboardSummary,
} from "../services/dashboardService";


// =============================================================================
// Market Hours
// =============================================================================

function isMarketHours(): boolean {
    const now = new Date();

    const indiaTime = new Intl.DateTimeFormat(
        "en-IN",
        {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }
    ).format(now);

    const [hour, minute] = indiaTime
        .split(":")
        .map(Number);

    const totalMinutes = hour * 60 + minute;

    // NSE normal equity market:
    // 09:15 AM - 03:30 PM IST
    return (
        totalMinutes >= 9 * 60 + 15 &&
        totalMinutes <= 15 * 60 + 30
    );
}


// =============================================================================
// Dashboard Summary
// =============================================================================

export function useDashboardSummary() {
    return useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: getDashboardSummary,

        // Refresh every 10 seconds while market is open.
        refetchInterval: () =>
            isMarketHours() ? 10_000 : false,

        // Don't keep polling when browser tab is in background.
        refetchIntervalInBackground: false,
    });
}


// =============================================================================
// Complete Dashboard
// =============================================================================

export function useDashboard() {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboard,

        // Refresh every 10 seconds while market is open.
        refetchInterval: () =>
            isMarketHours() ? 10_000 : false,

        refetchIntervalInBackground: false,
    });
}