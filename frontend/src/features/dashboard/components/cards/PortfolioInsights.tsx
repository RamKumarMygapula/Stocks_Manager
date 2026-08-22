import {
    Paper,
    Typography,
    Grid,
    Box
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PercentIcon from "@mui/icons-material/Percent";

import { useDashboard } from "../../hooks/useDashboard";

// =============================================================================
// Insight Card
// =============================================================================

interface InsightCardProps {

    icon: React.ReactNode;

    title: string;

    value: string;

    subtitle?: string;

    color: string;

}

function InsightCard({

    icon,

    title,

    value,

    subtitle,

    color

}: InsightCardProps) {

    return (

        <Paper

            elevation={2}

            sx={{

                p: 2,

                height: "100%",

                borderRadius: 3,

                transition: "0.25s",

                "&:hover": {

                    transform: "translateY(-4px)",

                    boxShadow: 6

                }

            }}

        >

            <Box

                display="flex"

                alignItems="center"

                gap={1}

                mb={1}

            >

                <Box sx={{ color }}>

                    {icon}

                </Box>

                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    {title}

                </Typography>

            </Box>

            <Typography

                fontWeight="bold"

                fontSize={15}

            >

                {value}

            </Typography>

            {subtitle && (

                <Typography

                    variant="body2"

                    sx={{

                        color,

                        mt: 0.5,

                        fontWeight: 600

                    }}

                >

                    {subtitle}

                </Typography>

            )}

        </Paper>

    );

}

// =============================================================================
// Portfolio Insights
// =============================================================================

export default function PortfolioInsights() {

    const {

        data,

        isLoading

    } = useDashboard();

    if (isLoading || !data) {

        return (

            <Paper sx={{ p: 3 }}>

                Loading...

            </Paper>

        );

    }

    const portfolio = data.portfolio;

    const best = [...portfolio].sort(

        (a, b) =>

            b.return_percent -

            a.return_percent

    )[0];

    const worst = [...portfolio].sort(

        (a, b) =>

            a.return_percent -

            b.return_percent

    )[0];

    const highestInvestment = [...portfolio].sort(

        (a, b) =>

            b.invested_amount -

            a.invested_amount

    )[0];

    const sectors = new Set(

        portfolio.map(

            (p) => p.sector

        )

    );

    const avgDays = Math.round(

        portfolio.reduce(

            (sum, p) =>

                sum + p.days_invested,

            0

        ) / portfolio.length

    );

    const avgReturn =

        portfolio.reduce(

            (sum, p) =>

                sum + p.return_percent,

            0

        ) / portfolio.length;

    return (

        <Paper

            sx={{

                p: 3,

                height: "100%",

                borderRadius: 3

            }}

        >

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    color: "#1E293B",
                    letterSpacing: 0.3,
                    mb: 2.5
                }}
            >
                Portfolio Insights
            </Typography>

            <Grid

                container

                spacing={2}

            >

                <Grid size={{ xs: 12, sm: 6 }}>

                    <InsightCard

                        icon={<TrendingUpIcon />}

                        title="Best Performer"

                        value={best.company_name}

                        subtitle={`${best.return_percent.toFixed(2)}%`}

                        color="#2E7D32"

                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <InsightCard

                        icon={<TrendingDownIcon />}

                        title="Worst Performer"

                        value={worst.company_name}

                        subtitle={`${worst.return_percent.toFixed(2)}%`}

                        color="#D32F2F"

                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <InsightCard

                        icon={<AccountBalanceWalletIcon />}

                        title="Highest Investment"

                        value={highestInvestment.company_name}

                        subtitle={`₹ ${highestInvestment.invested_amount.toLocaleString("en-IN")}`}

                        color="#1565C0"

                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <InsightCard

                        icon={<BusinessIcon />}

                        title="Total Sectors"

                        value={`${sectors.size}`}

                        subtitle="Diversified"

                        color="#7B1FA2"

                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <InsightCard

                        icon={<ScheduleIcon />}

                        title="Average Holding"

                        value={`${avgDays} Days`}

                        color="#F57C00"

                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <InsightCard

                        icon={<PercentIcon />}

                        title="Average Return"

                        value={`${avgReturn.toFixed(2)}%`}

                        color={
                            avgReturn >= 0

                                ? "#2E7D32"

                                : "#D32F2F"
                        }

                    />

                </Grid>

            </Grid>

        </Paper>

    );

}