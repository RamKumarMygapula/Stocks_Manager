// =============================================================================
// Portfolio Row Model
// Represents one row in the dashboard portfolio table.
// =============================================================================

export interface PortfolioRow {

    id: number;

    symbol: string;

    company_name: string;

    quantity: number;

    buy_date: string;

    buy_price: number;

    current_price: number;

    invested_amount: number;

    current_value: number;

    profit_loss: number;

    return_percent: number;

    sector: string;

    days_invested: number;

    market_cap: number;

    book_value: number;

    previous_close: number;

    one_day_profit: number;

}