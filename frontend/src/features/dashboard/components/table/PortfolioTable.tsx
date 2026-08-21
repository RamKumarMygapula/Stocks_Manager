import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { DataGrid } from "@mui/x-data-grid";

import { usePortfolio } from "../../hooks/usePortfolio";

import { portfolioColumns } from "./PortfolioColumns";

import type { DashboardStock } from "../../types/dashboard";

interface Props {

    onView: (stock: DashboardStock) => void;

    onEdit: (stock: DashboardStock) => void;

    onDelete: (stock: DashboardStock) => void;

    onAdd: () => void;

}

export default function PortfolioTable({

    onView,

    onEdit,

    onDelete,

    onAdd

}: Props) {

    const {

        data,

        isLoading,

        error

    } = usePortfolio();

    if (isLoading) {

        return (

            <Paper sx={{ p: 3 }}>

                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >

                    <CircularProgress />

                </Box>

            </Paper>

        );

    }

    if (error) {

        return (

            <Alert severity="error">

                Failed to load portfolio.

            </Alert>

        );

    }

    return (

        <Paper
            sx={{
                p: 2,
                borderRadius: 3
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                >

                    Portfolio

                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                >

                    Add Stock

                </Button>

            </Box>

            <DataGrid

                rows={data ?? []}

                columns={portfolioColumns(

                    onView,

                    onEdit,

                    onDelete

                )}

                autoHeight

                pageSizeOptions={[5, 10, 20]}

                initialState={{

                    pagination: {

                        paginationModel: {

                            pageSize: 5,

                            page: 0

                        }

                    }

                }}

                disableRowSelectionOnClick

            />

        </Paper>

    );

}