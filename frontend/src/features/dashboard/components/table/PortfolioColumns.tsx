import {
    Tooltip,
    IconButton
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { GridColDef } from "@mui/x-data-grid";


// =============================================================================
// Helpers
// =============================================================================

const formatCurrency = (value: unknown) => {

    const number = Number(value ?? 0);

    return `₹${number.toFixed(2)}`;

};


const formatPercent = (value: unknown) => {

    const number = Number(value ?? 0);

    return `${number.toFixed(2)}%`;

};


// =============================================================================
// Portfolio Columns
// =============================================================================

export const portfolioColumns = (

    onView: any,

    onEdit: any,

    onDelete: any

): GridColDef[] => [

    // =========================================================================
    // Company
    // =========================================================================

    {
        field: "company_name",

        headerName: "Company",

        flex: 2,

        minWidth: 220
    },


    // =========================================================================
    // Quantity
    // =========================================================================

    {
        field: "quantity",

        headerName: "Qty",

        width: 80,

        type: "number"
    },


    // =========================================================================
    // Buy Price
    // =========================================================================

    {
        field: "buy_price",

        headerName: "Buy Price",

        width: 120,

        valueFormatter: (value) =>
            formatCurrency(value)
    },


    // =========================================================================
    // Current Price
    // =========================================================================

    {
        field: "current_price",

        headerName: "Current",

        width: 120,

        valueFormatter: (value) =>
            formatCurrency(value)
    },


    // =========================================================================
    // Today's P/L
    // =========================================================================

    {
        field: "one_day_profit",

        headerName: "Today",

        width: 130,

        renderCell: (params) => {

            const value = Number(params.value ?? 0);

            return (

                <span
                    style={{
                        color:
                            value >= 0
                                ? "green"
                                : "red",

                        fontWeight: 600
                    }}
                >

                    {value >= 0 ? "+" : ""}

                    {formatCurrency(value)}

                </span>

            );

        }
    },


    // =========================================================================
    // Invested
    // =========================================================================

    {
        field: "invested_amount",

        headerName: "Invested",

        width: 130,

        valueFormatter: (value) =>
            formatCurrency(value)
    },


    // =========================================================================
    // Current Value
    // =========================================================================

    {
        field: "current_value",

        headerName: "Current Value",

        width: 145,

        valueFormatter: (value) =>
            formatCurrency(value)
    },


    // =========================================================================
    // Overall Profit / Loss
    // =========================================================================

    {
        field: "profit_loss",

        headerName: "Profit / Loss",

        width: 140,

        renderCell: (params) => {

            const value = Number(params.value ?? 0);

            return (

                <span
                    style={{
                        color:
                            value >= 0
                                ? "green"
                                : "red",

                        fontWeight: 600
                    }}
                >

                    {value >= 0 ? "+" : ""}

                    {formatCurrency(value)}

                </span>

            );

        }
    },


    // =========================================================================
    // Overall Return %
    // =========================================================================

    {
        field: "return_percent",

        headerName: "Return %",

        width: 110,

        renderCell: (params) => {

            const value = Number(params.value ?? 0);

            return (

                <span
                    style={{
                        color:
                            value >= 0
                                ? "green"
                                : "red",

                        fontWeight: 600
                    }}
                >

                    {value >= 0 ? "+" : ""}

                    {formatPercent(value)}

                </span>

            );

        }
    },


    // =========================================================================
    // Days Held
    // =========================================================================

    {
        field: "days_invested",

        headerName: "Days Held",

        width: 110,

        type: "number"
    },


    // =========================================================================
    // Actions
    // =========================================================================

    {
        field: "actions",

        headerName: "Actions",

        width: 150,

        sortable: false,

        filterable: false,

        renderCell: (params) => (

            <>

                <Tooltip title="View">

                    <IconButton

                        size="small"

                        onClick={() =>
                            onView(params.row)
                        }

                    >

                        <VisibilityIcon
                            fontSize="small"
                        />

                    </IconButton>

                </Tooltip>


                <Tooltip title="Edit">

                    <IconButton

                        size="small"

                        onClick={() =>
                            onEdit(params.row)
                        }

                    >

                        <EditIcon
                            fontSize="small"
                        />

                    </IconButton>

                </Tooltip>


                <Tooltip title="Delete">

                    <IconButton

                        size="small"

                        color="error"

                        onClick={() =>
                            onDelete(params.row)
                        }

                    >

                        <DeleteIcon
                            fontSize="small"
                        />

                    </IconButton>

                </Tooltip>

            </>

        )

    }

];