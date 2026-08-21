import {
    Box,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import { useState } from "react";

import SummaryCards from "../components/cards/SummaryCards";
import PortfolioTable from "../components/table/PortfolioTable";
import PortfolioInsights from "../components/cards/PortfolioInsights";
import SectorPieChart from "../components/charts/SectorPieChart";
import StockDetailsDrawer from "../components/drawer/StockDetailsDrawer";
import AddStockDialog from "../components/dialogs/AddStockDialog";
import {

    IconButton

} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";

import {

    useContext

} from "react";

import { ThemeModeContext } from "../../../app/ThemeContext";
import type { DashboardStock } from "../types/dashboard";

export default function DashboardPage() {

    // ==========================================================
    // Drawer State
    // ==========================================================

    const [selectedStock, setSelectedStock] =
        useState<DashboardStock | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);
    const themeMode = useContext(ThemeModeContext);
    // ==========================================================
    // Add / Edit Dialog
    // ==========================================================

    const [addOpen, setAddOpen] =
        useState(false);

    const [editingStock, setEditingStock] =
        useState<DashboardStock | null>(null);

    // ==========================================================
    // View Stock
    // ==========================================================

    const handleViewStock = (
        stock: DashboardStock
    ) => {

        setSelectedStock(stock);

        setDrawerOpen(true);

    };

    // ==========================================================
    // Edit Stock
    // ==========================================================

    const handleEditStock = (
        stock: DashboardStock
    ) => {

        setEditingStock(stock);

        setAddOpen(true);

    };

    // ==========================================================
    // Delete Stock
    // ==========================================================

    const handleDeleteStock = (
        stock: DashboardStock
    ) => {

        console.log("Delete", stock);

    };

    return (

        <Box sx={{ p: 3 }}>

            {/* ========================================================== */}
            {/* Dashboard Title */}
            {/* ========================================================== */}

            <Box

                sx={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    mb: 3

                }}

            >

                <Typography

                    variant="h4"

                    fontWeight={700}

                >

                    📈 Stock Manager Dashboard

                </Typography>

                <IconButton

                    onClick={themeMode.toggleTheme}

                >

                    <DarkModeIcon />

                </IconButton>

            </Box>

            {/* ========================================================== */}
            {/* Summary Cards */}
            {/* ========================================================== */}

            <SummaryCards />

            {/* ========================================================== */}
            {/* Portfolio + Insights */}
            {/* ========================================================== */}

            <Grid
                container
                spacing={3}
                sx={{ mt: 2 }}
            >

                <Grid size={{ xs: 12, lg: 8 }}>

                    <PortfolioTable

                        onView={handleViewStock}

                        onEdit={handleEditStock}

                        onDelete={handleDeleteStock}

                        onAdd={() => {

                            setEditingStock(null);

                            setAddOpen(true);

                        }}

                    />

                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>

                    <PortfolioInsights />

                </Grid>

            </Grid>

            {/* ========================================================== */}
            {/* Sector Allocation */}
            {/* ========================================================== */}

            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >

                <Grid size={{ xs: 12, lg: 6 }}>

                    <Paper
                        sx={{
                            p: 3,
                            height: 380,
                            borderRadius: 3
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            mb={2}
                        >

                            Sector Allocation

                        </Typography>

                        <SectorPieChart />

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>

                    <Paper
                        sx={{
                            p: 3,
                            height: 380,
                            borderRadius: 3
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >

                            Coming Soon

                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

            {/* ========================================================== */}
            {/* Stock Details Drawer */}
            {/* ========================================================== */}

            <StockDetailsDrawer

                open={drawerOpen}

                stock={selectedStock}

                onClose={() => setDrawerOpen(false)}

            />

            {/* ========================================================== */}
            {/* Add / Edit Dialog */}
            {/* ========================================================== */}

            <AddStockDialog

                open={addOpen}

                stock={editingStock}

                onClose={() => {

                    setAddOpen(false);

                    setEditingStock(null);

                }}

            />

        </Box>

    );

}