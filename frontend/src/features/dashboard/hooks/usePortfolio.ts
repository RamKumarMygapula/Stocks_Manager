import { useQuery } from "@tanstack/react-query";

import { getPortfolio } from "../services/portfolioService";


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

    return (
        totalMinutes >= 9 * 60 + 15 &&
        totalMinutes <= 15 * 60 + 30
    );
}


// =============================================================================
// Portfolio
// =============================================================================

export function usePortfolio() {
    return useQuery({
        queryKey: ["portfolio"],
        queryFn: getPortfolio,

        // Refresh every 15 seconds during market hours.
        refetchInterval: () =>
            isMarketHours() ? 15_000 : false,

        refetchIntervalInBackground: false,
    });
}