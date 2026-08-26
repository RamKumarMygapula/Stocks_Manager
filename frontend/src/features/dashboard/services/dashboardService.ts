import axios from "axios";

import type {
    DashboardSummary,
    DashboardResponse
} from "../types/dashboard";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

// =============================================================================
// Dashboard Summary
// =============================================================================

export async function getDashboardSummary(): Promise<DashboardSummary> {

    const response = await api.get("/dashboard/summary");

    return response.data;

}

// =============================================================================
// Complete Dashboard
// =============================================================================

export async function getDashboard(): Promise<DashboardResponse> {

    const response = await api.get("/dashboard");

    return response.data;

}

// =============================================================================
// Stock Details
// =============================================================================

export async function getStockDetails(symbol: string) {
    try {
        const response = await api.get(
            `/dashboard/stock/${encodeURIComponent(symbol)}`
        );

        console.log("AXIOS STOCK DETAILS RESPONSE:", response);
        console.log(
            "AXIOS STOCK DETAILS DATA:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "AXIOS STOCK DETAILS ERROR:",
            error
        );

        throw error;
    }
}