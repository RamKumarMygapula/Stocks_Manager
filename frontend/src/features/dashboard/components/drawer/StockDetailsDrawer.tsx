import {
    Drawer,
    Box,
    Typography,
    Divider,
    Paper,
    Chip,
    Stack
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import ShowChartIcon from "@mui/icons-material/ShowChart";

interface Props {
    open: boolean;
    onClose: () => void;
    stock: any;
}

function DetailRow({
    label,
    value
}: {
    label: string;
    value: any;
}) {

    return (

        <Box

            sx={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                py: 1.2,

                borderBottom: "1px solid",

                borderColor: "divider"

            }}

        >

            <Typography

                variant="body2"

                color="text.secondary"

                sx={{

                    fontWeight: 500

                }}

            >

                {label}

            </Typography>

            <Box

                sx={{

                    textAlign: "right",

                    maxWidth: "55%"

                }}

            >

                {typeof value === "string" ||

                typeof value === "number"

                    ? (

                        <Typography

                            variant="body1"

                            fontWeight={700}

                        >

                            {value}

                        </Typography>

                    )

                    : value}

            </Box>

        </Box>

    );

}

export default function StockDetailsDrawer({

    open,

    onClose,

    stock

}: Props) {

    if (!stock) return null;

    const positive = stock.profit_loss >= 0;

    return (

        <Drawer

            anchor="right"

            open={open}

            onClose={onClose}

        >

            <Box

                sx={{

                    width: 430,

                    p: 3,

                    bgcolor: "background.default",

                    height: "100%",

                    overflowY: "auto"

                }}

            >

                {/* ===================================================== */}
                {/* Header */}
                {/* ===================================================== */}

                <Typography

                    variant="h5"

                    fontWeight={700}

                >

                    {stock.company_name}

                </Typography>

                <Typography

                    color="text.secondary"

                    mb={1}

                >

                    {stock.symbol}

                </Typography>

                <Chip

                    label={stock.sector}

                    color="primary"

                    size="small"

                    sx={{ mb: 3 }}

                />

                {/* ===================================================== */}
                {/* Current Price */}
                {/* ===================================================== */}

                <Paper

                    elevation={2}

                    sx={{

                        p: 2,

                        borderRadius: 3,

                        mb: 3,

                        textAlign: "center"

                    }}

                >

                    <Typography

                        variant="body2"

                        color="text.secondary"

                    >

                        Current Price

                    </Typography>

                    <Typography

                        variant="h4"

                        fontWeight={700}

                        color="primary"

                    >

                        ₹{stock.current_price.toLocaleString()}

                    </Typography>

                    <Stack

                        direction="row"

                        spacing={1}

                        justifyContent="center"

                        mt={1}

                    >

                        {stock.one_day_profit >= 0 ?

                            <TrendingUpIcon color="success" />

                            :

                            <TrendingDownIcon color="error" />

                        }

                        <Typography

                            color={

                                stock.one_day_profit >= 0

                                    ? "success.main"

                                    : "error.main"

                            }

                            fontWeight={700}

                        >

                            ₹{stock.one_day_profit.toLocaleString()}

                        </Typography>

                    </Stack>

                </Paper>

                {/* ===================================================== */}
                {/* Investment */}
                {/* ===================================================== */}

                <Paper

                    sx={{

                        p: 2,

                        mb: 3,

                        borderRadius: 3

                    }}

                >

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                        mb={1}

                    >

                        <AccountBalanceWalletIcon color="primary" />

                        <Typography

                            variant="h6"

                            fontWeight={700}

                        >

                            Investment

                        </Typography>

                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    <DetailRow

                        label="Buy Price"

                        value={`₹${stock.buy_price.toLocaleString()}`}

                    />

                    <DetailRow

                        label="Quantity"

                        value={stock.quantity}

                    />

                    <DetailRow

                        label="Invested"

                        value={`₹${stock.invested_amount.toLocaleString()}`}

                    />

                </Paper>

                {/* ===================================================== */}
                {/* Performance */}
                {/* ===================================================== */}

                <Paper

                    sx={{

                        p: 2,

                        mb: 3,

                        borderRadius: 3

                    }}

                >

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                        mb={1}

                    >

                        <ShowChartIcon color="primary" />

                        <Typography

                            variant="h6"

                            fontWeight={700}

                        >

                            Performance

                        </Typography>

                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    <DetailRow

                        label="Current Value"

                        value={`₹${stock.current_value.toLocaleString()}`}

                    />

                    <DetailRow

                        label="Profit / Loss"

                        value={

                            <Typography

                                fontWeight={700}

                                color={

                                    positive

                                        ? "success.main"

                                        : "error.main"

                                }

                            >

                                ₹{stock.profit_loss.toLocaleString()}

                            </Typography>

                        }

                    />

                    <DetailRow

                        label="Return"

                        value={

                            <Typography

                                fontWeight={700}

                                color={

                                    positive

                                        ? "success.main"

                                        : "error.main"

                                }

                            >

                                {stock.return_percent}%

                            </Typography>

                        }

                    />

                    <DetailRow

                        label="Today's P/L"

                        value={`₹${stock.one_day_profit.toLocaleString()}`}

                    />

                </Paper>

                {/* ===================================================== */}
                {/* Company */}
                {/* ===================================================== */}

                <Paper

                    sx={{

                        p: 2,

                        borderRadius: 3

                    }}

                >

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                        mb={1}

                    >

                        <BusinessIcon color="primary" />

                        <Typography

                            variant="h6"

                            fontWeight={700}

                        >

                            Company

                        </Typography>

                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    <DetailRow

                        label="Sector"

                        value={stock.sector}

                    />

                    <DetailRow

                        label="Market Cap"

                        value={

                            stock.market_cap

                                ? `₹${stock.market_cap.toLocaleString()}`

                                : "-"

                        }

                    />

                    <DetailRow

                        label="Book Value"

                        value={

                            stock.book_value ?? "-"

                        }

                    />

                    <DetailRow

                        label="Days Held"

                        value={`${stock.days_invested} Days`}

                    />

                </Paper>

            </Box>

        </Drawer>

    );

}