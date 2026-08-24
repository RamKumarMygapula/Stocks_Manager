import {
    Drawer,
    Box,
    Typography,
    Divider,
    Paper,
    Chip,
    Stack,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useEffect, useState } from "react";

import { getStockDetails } from "../../services/dashboardService";

interface Props {
    open: boolean;
    onClose: () => void;
    stock: any;
}

function DetailRow({
    label,
    value,
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
                borderColor: "divider",
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={700}
                sx={{
                    textAlign: "right",
                    maxWidth: "55%",
                }}
            >
                {value ?? "N/A"}
            </Typography>
        </Box>
    );
}

function formatNumber(
    value: any,
    prefix = "",
    decimals = 2
) {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    if (typeof value === "number") {
        return `${prefix}${value.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })}`;
    }

    return `${prefix}${value}`;
}

function formatInteger(value: any) {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    if (typeof value === "number") {
        return value.toLocaleString("en-IN");
    }

    return value;
}

function formatPercent(value: any) {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    if (typeof value === "number") {
        return `${value.toFixed(2)}%`;
    }

    return value;
}

export default function StockDetailsDrawer({
    open,
    onClose,
    stock,
}: Props) {
    const [stockDetails, setStockDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        console.log("DRAWER EFFECT:", {
            open,
            stock,
            symbol: stock?.symbol,
        });

        if (!open || !stock?.symbol) {
            console.log("NOT FETCHING:", {
                open,
                symbol: stock?.symbol,
            });

            return;
        }

        const fetchStockDetails = async () => {
            console.log(
                "CALLING STOCK DETAILS API:",
                stock.symbol
            );

            try {
                setLoadingDetails(true);

                const data = await getStockDetails(
                    stock.symbol
                );

                console.log(
                    "STOCK DETAILS RESPONSE:",
                    data
                );

                console.log(
                    "MARKET:",
                    data?.market
                );

                console.log(
                    "FUNDAMENTALS:",
                    data?.fundamentals
                );

                setStockDetails(data);
            } catch (error) {
                console.error(
                    "STOCK DETAILS ERROR:",
                    error
                );

                setStockDetails(null);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchStockDetails();
    }, [open, stock?.symbol]);

    if (!stock) {
        return null;
    }

    const market = stockDetails?.market ?? {};
    const fundamentals =
        stockDetails?.fundamentals ?? {};

    const portfolioProfit =
        Number(stock.profit_loss ?? 0);

    const positive = portfolioProfit >= 0;

    const todayChange =
        market.today_change;

    const todayChangePercent =
        market.today_change_percent;

    const todayPositive =
        typeof todayChange === "number"
            ? todayChange >= 0
            : true;

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
                    overflowY: "auto",
                    boxSizing: "border-box",
                }}
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

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

                {stock.sector && (
                    <Chip
                        label={stock.sector}
                        color="primary"
                        size="small"
                        sx={{ mb: 3 }}
                    />
                )}

                {/* ================================================= */}
                {/* CURRENT PRICE */}
                {/* ================================================= */}

                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        mb: 3,
                        textAlign: "center",
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
                        {formatNumber(
                            stock.current_price,
                            "₹"
                        )}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                        mt={1}
                    >
                        {stock.one_day_profit >= 0 ? (
                            <TrendingUpIcon color="success" />
                        ) : (
                            <TrendingDownIcon color="error" />
                        )}

                        <Typography
                            color={
                                stock.one_day_profit >= 0
                                    ? "success.main"
                                    : "error.main"
                            }
                            fontWeight={700}
                        >
                            {formatNumber(
                                stock.one_day_profit,
                                "₹"
                            )}
                        </Typography>
                    </Stack>
                </Paper>

                {/* ================================================= */}
                {/* INVESTMENT */}
                {/* ================================================= */}

                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
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
                        value={formatNumber(
                            stock.buy_price,
                            "₹"
                        )}
                    />

                    <DetailRow
                        label="Quantity"
                        value={
                            stock.quantity ?? "N/A"
                        }
                    />

                    <DetailRow
                        label="Invested"
                        value={formatNumber(
                            stock.invested_amount,
                            "₹"
                        )}
                    />
                </Paper>

                {/* ================================================= */}
                {/* PERFORMANCE */}
                {/* ================================================= */}

                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
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
                        value={formatNumber(
                            stock.current_value,
                            "₹"
                        )}
                    />

                    <DetailRow
                        label="Profit / Loss"
                        value={
                            <Typography
                                component="span"
                                fontWeight={700}
                                color={
                                    positive
                                        ? "success.main"
                                        : "error.main"
                                }
                            >
                                {formatNumber(
                                    stock.profit_loss,
                                    "₹"
                                )}
                            </Typography>
                        }
                    />

                    <DetailRow
                        label="Return"
                        value={
                            <Typography
                                component="span"
                                fontWeight={700}
                                color={
                                    positive
                                        ? "success.main"
                                        : "error.main"
                                }
                            >
                                {formatPercent(
                                    stock.return_percent
                                )}
                            </Typography>
                        }
                    />

                    <DetailRow
                        label="Today's P/L"
                        value={formatNumber(
                            stock.one_day_profit,
                            "₹"
                        )}
                    />

                    <DetailRow
                        label="Days Held"
                        value={
                            stock.days_invested !==
                            undefined
                                ? `${stock.days_invested} Days`
                                : "N/A"
                        }
                    />
                </Paper>

                {/* ================================================= */}
                {/* TECHNICAL / MARKET DATA */}
                {/* ================================================= */}

                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
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
                            Technical / Market Data
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    {loadingDetails ? (
                        <Typography
                            color="text.secondary"
                            sx={{
                                py: 2,
                                textAlign: "center",
                            }}
                        >
                            Loading market data...
                        </Typography>
                    ) : (
                        <>
                            <DetailRow
                                label="Current Price"
                                value={formatNumber(
                                    market.current_price,
                                    "₹"
                                )}
                            />

                            <DetailRow
                                label="Previous Close"
                                value={formatNumber(
                                    market.previous_close,
                                    "₹"
                                )}
                            />

                            <DetailRow
                                label="Today's Change"
                                value={
                                    typeof todayChange ===
                                    "number" ? (
                                        <Typography
                                            component="span"
                                            fontWeight={700}
                                            color={
                                                todayPositive
                                                    ? "success.main"
                                                    : "error.main"
                                            }
                                        >
                                            {formatNumber(
                                                todayChange,
                                                "₹"
                                            )}
                                        </Typography>
                                    ) : (
                                        "N/A"
                                    )
                                }
                            />

                            <DetailRow
                                label="Today's Change %"
                                value={
                                    typeof todayChangePercent ===
                                    "number" ? (
                                        <Typography
                                            component="span"
                                            fontWeight={700}
                                            color={
                                                todayPositive
                                                    ? "success.main"
                                                    : "error.main"
                                            }
                                        >
                                            {formatPercent(
                                                todayChangePercent
                                            )}
                                        </Typography>
                                    ) : (
                                        "N/A"
                                    )
                                }
                            />

                            <DetailRow
                                label="52 Week High"
                                value={formatNumber(
                                    market.week_52_high,
                                    "₹"
                                )}
                            />

                            <DetailRow
                                label="52 Week Low"
                                value={formatNumber(
                                    market.week_52_low,
                                    "₹"
                                )}
                            />

                            <DetailRow
                                label="Volume"
                                value={formatInteger(
                                    market.volume
                                )}
                            />

                            <DetailRow
                                label="Market Cap"
                                value={formatNumber(
                                    market.market_cap,
                                    "₹",
                                    0
                                )}
                            />
                        </>
                    )}
                </Paper>

                {/* ================================================= */}
                {/* FUNDAMENTALS */}
                {/* ================================================= */}

                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1}
                    >
                        <AssessmentIcon color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Fundamentals
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    {loadingDetails ? (
                        <Typography
                            color="text.secondary"
                            sx={{
                                py: 2,
                                textAlign: "center",
                            }}
                        >
                            Loading fundamentals...
                        </Typography>
                    ) : (
                        <>
                            <DetailRow
                                label="Revenue"
                                value={formatNumber(
                                    fundamentals.revenue,
                                    "₹",
                                    0
                                )}
                            />

                            <DetailRow
                                label="Profit"
                                value={formatNumber(
                                    fundamentals.profit,
                                    "₹",
                                    0
                                )}
                            />

                            <DetailRow
                                label="EPS"
                                value={formatNumber(
                                    fundamentals.eps,
                                    "₹"
                                )}
                            />

                            <DetailRow
                                label="P/E Ratio"
                                value={formatNumber(
                                    fundamentals.pe_ratio
                                )}
                            />

                            <DetailRow
                                label="P/B Ratio"
                                value={formatNumber(
                                    fundamentals.pb_ratio
                                )}
                            />

                            <DetailRow
                                label="Book Value"
                                value={formatNumber(
                                    fundamentals.book_value,
                                    "₹"
                                )}
                            />

                            <DetailRow
                                label="Debt"
                                value={formatNumber(
                                    fundamentals.debt,
                                    "₹",
                                    0
                                )}
                            />

                            <DetailRow
                                label="Debt / Equity"
                                value={formatNumber(
                                    fundamentals.debt_equity
                                )}
                            />

                            <DetailRow
                                label="ROE"
                                value={formatPercent(
                                    fundamentals.roe
                                )}
                            />

                            <DetailRow
                                label="ROCE"
                                value={formatPercent(
                                    fundamentals.roce
                                )}
                            />

                            <DetailRow
                                label="Dividend Yield"
                                value={formatPercent(
                                    fundamentals.dividend_yield
                                )}
                            />
                        </>
                    )}
                </Paper>

                {/* ================================================= */}
                {/* COMPANY */}
                {/* ================================================= */}

                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
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
                        label="Company"
                        value={
                            stockDetails?.company_name ??
                            stock.company_name ??
                            "N/A"
                        }
                    />

                    <DetailRow
                        label="Symbol"
                        value={
                            stockDetails?.symbol ??
                            stock.symbol ??
                            "N/A"
                        }
                    />

                    <DetailRow
                        label="Sector"
                        value={
                            stockDetails?.sector ??
                            stock.sector ??
                            "N/A"
                        }
                    />
                </Paper>
            </Box>
        </Drawer>
    );
}