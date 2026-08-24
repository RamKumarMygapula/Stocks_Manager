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


    /*
     * Sort by today's return.
     *
     * Highest positive return first.
     */
    const sortedData = [...(data ?? [])].sort(

        (a, b) =>

            (b.today_change_percent ?? 0) -
            (a.today_change_percent ?? 0)

    );


    return (

        <Paper

            sx={{

                p: 2,

                borderRadius: 3,

                /*
                 * Important:
                 * Gives the DataGrid a fixed area so that
                 * the portfolio itself can scroll.
                 */
                height: 500,

                display: "flex",

                flexDirection: "column"

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


            <Box

                sx={{

                    flex: 1,

                    minHeight: 0,

                    width: "100%"

                }}

            >

                <DataGrid

                    rows={sortedData}

                    columns={portfolioColumns(

                        onView,

                        onEdit,

                        onDelete

                    )}

                    /*
                     * No pagination.
                     *
                     * All holdings are displayed and the
                     * DataGrid scrolls internally.
                     */
                    pagination={false}

                    disableRowSelectionOnClick

                    sx={{

                        border: "none",

                        "& .MuiDataGrid-virtualScroller": {

                            overflowY: "auto"

                        }

                    }}

                />

            </Box>

        </Paper>

    );

}