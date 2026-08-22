import {
    Tooltip,
    IconButton
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { GridColDef } from "@mui/x-data-grid";


// =============================================================================
// Portfolio Columns
// =============================================================================

export const portfolioColumns = (

    onView: any,

    onEdit: any,

    onDelete: any

): GridColDef[] => [

    {
        field: "company_name",
        headerName: "Company",
        flex: 2,
        minWidth: 220
    },


    {
        field: "quantity",
        headerName: "Qty",
        width: 90,
        type: "number"
    },


    {
        field: "buy_price",
        headerName: "Buy Price",
        width: 120,

        valueFormatter: (value) =>
            `₹${Number(value).toFixed(2)}`
    },


    {
        field: "current_price",
        headerName: "Current",
        width: 120,

        valueFormatter: (value) =>
            `₹${Number(value).toFixed(2)}`
    },


    {
        field: "invested_amount",
        headerName: "Invested",
        width: 130,

        valueFormatter: (value) =>
            `₹${Number(value).toFixed(2)}`
    },


    {
        field: "current_value",
        headerName: "Current Value",
        width: 150,

        valueFormatter: (value) =>
            `₹${Number(value).toFixed(2)}`
    },


    {
        field: "profit_loss",
        headerName: "Profit / Loss",
        width: 150,

        renderCell: (params) => (

            <span
                style={{
                    color:
                        params.value >= 0
                            ? "green"
                            : "red",

                    fontWeight: 600
                }}
            >

                ₹{Number(params.value).toFixed(2)}

            </span>

        )
    },


    {
        field: "return_percent",
        headerName: "Return %",
        width: 110,

        renderCell: (params) => (

            <span
                style={{
                    color:
                        params.value >= 0
                            ? "green"
                            : "red",

                    fontWeight: 600
                }}
            >

                {Number(params.value).toFixed(2)}%

            </span>

        )
    },


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