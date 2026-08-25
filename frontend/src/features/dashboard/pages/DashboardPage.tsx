import { useState } from "react";

import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import SummaryCards from "../components/cards/SummaryCards";
import PortfolioTable from "../components/table/PortfolioTable";
import PortfolioInsights from "../components/cards/PortfolioInsights";
import SectorPieChart from "../components/charts/SectorPieChart";
import NewsFeed from "../components/news/NewsFeed";
import StockDetailsDrawer from "../components/drawer/StockDetailsDrawer";

import { useDashboard } from "../hooks/useDashboard";
import { usePortfolio } from "../hooks/usePortfolio";

import type { PortfolioStock } from "../types/portfolio";


const DashboardPage = () => {

    // ========================================================================
    // Dashboard data
    // ========================================================================

    const {
        data: dashboardData,
        isLoading: dashboardLoading,
        isError: dashboardError,
    } = useDashboard();

    const {
        data: portfolioData,
        isLoading: portfolioLoading,
    } = usePortfolio();


    // ========================================================================
    // Stock details drawer
    // ========================================================================

    const [selectedStock, setSelectedStock] =
        useState<PortfolioStock | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);


    const handleView = (stock: PortfolioStock) => {
        setSelectedStock(stock);
        setDrawerOpen(true);
    };


    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedStock(null);
    };


    // ========================================================================
    // Loading
    // ========================================================================

    if (dashboardLoading || portfolioLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>
                    Loading dashboard...
                </Typography>
            </Box>
        );
    }


    // ========================================================================
    // Error
    // ========================================================================

    if (dashboardError) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">
                    Unable to load dashboard data.
                </Typography>
            </Box>
        );
    }


    // ========================================================================
    // Dashboard
    // ========================================================================

    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                p: 3,
            }}
        >

            {/* ============================================================= */}
            {/* PAGE TITLE                                                      */}
            {/* ============================================================= */}

            <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                    mb: 3,
                    color: "text.primary",
                }}
            >
                Dashboard
            </Typography>


            {/* ============================================================= */}
            {/* SUMMARY CARDS                                                   */}
            {/* ============================================================= */}

            <Box
                sx={{
                    width: "100%",
                    mb: 3,
                }}
            >
                <SummaryCards
                    data={dashboardData}
                />
            </Box>


            {/* ============================================================= */}
            {/* PORTFOLIO + INSIGHTS                                            */}
            {/* ============================================================= */}

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    gap: 3,
                    mb: 3,

                    flexDirection: {
                        xs: "column",
                        lg: "row",
                    },

                    alignItems: "stretch",
                }}
            >

                {/* --------------------------------------------------------- */}
                {/* Portfolio                                                   */}
                {/* --------------------------------------------------------- */}

                <Box
                    sx={{
                        flex: {
                            xs: "none",
                            lg: "2 1 0",
                        },

                        width: {
                            xs: "100%",
                            lg: "auto",
                        },

                        minWidth: 0,

                        height: 500,

                        overflow: "hidden",
                    }}
                >
                    <PortfolioTable
                        stocks={portfolioData ?? []}
                        onView={handleView}
                    />
                </Box>


                {/* --------------------------------------------------------- */}
                {/* Portfolio Insights                                          */}
                {/* --------------------------------------------------------- */}

                <Box
                    sx={{
                        flex: {
                            xs: "none",
                            lg: "1 1 0",
                        },

                        width: {
                            xs: "100%",
                            lg: "auto",
                        },

                        minWidth: 0,

                        height: 500,

                        overflow: "hidden",
                    }}
                >
                    <PortfolioInsights />
                </Box>

            </Box>


            {/* ============================================================= */}
            {/* SECTOR + NEWS                                                   */}
            {/* ============================================================= */}

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    gap: 3,

                    flexDirection: {
                        xs: "column",
                        lg: "row",
                    },

                    alignItems: "stretch",
                }}
            >

                {/* --------------------------------------------------------- */}
                {/* Sector Allocation                                           */}
                {/* --------------------------------------------------------- */}

                <Box
                    sx={{
                        flex: {
                            xs: "none",
                            lg: "1 1 0",
                        },

                        width: {
                            xs: "100%",
                            lg: "auto",
                        },

                        minWidth: 0,
                    }}
                >

                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            height: 340,

                            p: 3,

                            borderRadius: 3,

                            display: "flex",
                            flexDirection: "column",

                            overflow: "hidden",

                            bgcolor: "background.paper",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 1,
                                color: "text.primary",
                            }}
                        >
                            Sector Allocation
                        </Typography>

                        <Box
                            sx={{
                                flex: 1,
                                minHeight: 0,

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SectorPieChart />
                        </Box>

                    </Paper>

                </Box>


                {/* --------------------------------------------------------- */}
                {/* News Feed                                                    */}
                {/* --------------------------------------------------------- */}

                <Box
                    sx={{
                        flex: {
                            xs: "none",
                            lg: "2 1 0",
                        },

                        width: {
                            xs: "100%",
                            lg: "auto",
                        },

                        minWidth: 0,

                        height: 340,

                        overflow: "hidden",
                    }}
                >
                    <NewsFeed />
                </Box>

            </Box>


            {/* ============================================================= */}
            {/* STOCK DETAILS DRAWER                                            */}
            {/* ============================================================= */}

            <StockDetailsDrawer
                open={drawerOpen}
                stock={selectedStock}
                onClose={handleCloseDrawer}
            />

        </Box>
    );
};


export default DashboardPage;