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