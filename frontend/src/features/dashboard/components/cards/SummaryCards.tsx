import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import SummaryCard from "./SummaryCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PaidIcon from "@mui/icons-material/Paid";
import PieChartIcon from "@mui/icons-material/PieChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { useDashboardSummary } from "../../hooks/useDashboard";

// =============================================================================
// Summary Cards Component
// =============================================================================

export default function SummaryCards() {

    const {
        data,
        isLoading,
        error
    } = useDashboardSummary();

    const formatCurrency = (value: number) =>
            `₹ ${value.toLocaleString("en-IN", {
                maximumFractionDigits: 2
            })}`;

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------

    if (isLoading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                p={4}
            >
                <CircularProgress />
            </Box>
        );

    }

    // -------------------------------------------------------------------------
    // Error
    // -------------------------------------------------------------------------

    if (error || !data) {

        return (
            <Alert severity="error">
                Failed to load dashboard summary.
            </Alert>
        );

    }

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    return (

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2,1fr)",
                    md: "repeat(3,1fr)",
                    lg: "repeat(6,1fr)"
                },
                gap: 2
            }}
        >

            <SummaryCard
                title="Holdings"
                value={data.total_holdings}
                subtitle="Stocks in portfolio"
                color="#5E35B1"
                icon={<Inventory2Icon />}
            />

            <SummaryCard
                title="Investment"
                value={formatCurrency(data.total_investment)}
                subtitle="Total invested"
                color="#1565C0"
                icon={<AccountBalanceWalletIcon />}
            />

            <SummaryCard
                title="Current Value"
                value={formatCurrency(data.current_value)}
                subtitle="Live portfolio value"
                color="#00897B"
                icon={<PieChartIcon />}
            />

            <SummaryCard
                title="Profit / Loss"
                value={formatCurrency(data.total_profit_loss)}
                subtitle="Overall gain/loss"
                color={
                    data.total_profit_loss >= 0
                        ? "#2E7D32"
                        : "#D32F2F"
                }
                icon={
                    data.total_profit_loss >= 0
                        ? <TrendingUpIcon />
                        : <TrendingDownIcon />
                }
            />

            <SummaryCard
                title="Return %"
                value={`${data.overall_return_percent.toFixed(2)} %`}
                subtitle="Portfolio return"
                color={
                    data.overall_return_percent >= 0
                        ? "#2E7D32"
                        : "#D32F2F"
                }
                icon={
                    data.overall_return_percent >= 0
                        ? <TrendingUpIcon />
                        : <TrendingDownIcon />
                }
            />

            <SummaryCard
                title="Today's P/L"
                value={formatCurrency(data.today_profit_loss)}
                subtitle="Today's movement"
                color={
                    data.today_profit_loss >= 0
                        ? "#EF6C00"
                        : "#D32F2F"
                }
                icon={<PaidIcon />}
            />

        </Box>

    );

}