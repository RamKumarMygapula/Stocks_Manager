import axios from "axios";
import type { PortfolioRow } from "../types/portfolio";

// =============================================================================
// Axios Instance
// =============================================================================

const api = axios.create({

    baseURL: "http://127.0.0.1:8000"

});

// =============================================================================
// Portfolio APIs
// =============================================================================

export async function getPortfolio(): Promise<PortfolioRow[]> {

    const response = await api.get("/dashboard/portfolio");

    return response.data;

}

// =============================================================================
// Add Stock
// =============================================================================

export async function addPortfolioStock(data: any) {

    const response = await api.post(

        "/dashboard/portfolio",

        data

    );

    return response.data;

}

// =============================================================================
// Update Stock
// =============================================================================

export async function updatePortfolioStock(

    id: number,

    data: any

) {

    const response = await api.put(

        `/dashboard/portfolio/${id}`,

        data

    );

    return response.data;

}
// =============================================================================
// Delete Stock
// =============================================================================

export async function deletePortfolioStock(

    id: number

) {

    const response = await api.delete(

        `/dashboard/portfolio/${id}`

    );

    return response.data;

}