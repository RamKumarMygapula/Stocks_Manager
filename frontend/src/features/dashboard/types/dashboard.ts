// =============================================================================
// Dashboard Summary
// =============================================================================

export interface DashboardSummary {

    total_holdings: number;

    total_investment: number;

    current_value: number;

    total_profit_loss: number;

    overall_return_percent: number;

    today_profit_loss: number;

}

// =============================================================================
// Dashboard Stock
// =============================================================================

export interface DashboardStock {

    id: number;

    symbol: string;

    company_name: string;

    sector: string;

    buy_date: string;

    buy_price: number;

    quantity: number;

    invested_amount: number;

    current_price: number;

    current_value: number;

    profit_loss: number;

    one_day_profit: number;

    return_percent: number;

    days_invested: number;

    market_cap: number;

    book_value: number;

}

// =============================================================================
// Sector Allocation
// =============================================================================

export interface SectorAllocation {

    sector: string;

    invested_amount: number;

}

// =============================================================================
// Complete Dashboard Response
// =============================================================================

export interface DashboardResponse {

    summary: DashboardSummary;

    portfolio: DashboardStock[];

    sector_distribution: SectorAllocation[];

}