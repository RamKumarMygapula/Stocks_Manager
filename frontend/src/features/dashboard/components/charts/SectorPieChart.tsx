import {
    Box,
    Paper,
    Typography
} from "@mui/material";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useDashboard } from "../../hooks/useDashboard";

const COLORS = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16"
];

// ==========================================================
// Tooltip
// ==========================================================

const CustomTooltip = ({ active, payload }: any) => {

    if (!active || !payload || !payload.length) {
        return null;
    }

    const sector = payload[0].payload;

    return (

        <Paper
            elevation={4}
            sx={{
                p: 2,
                borderRadius: 2,
                minWidth: 220
            }}
        >

            <Typography
                fontWeight="bold"
                mb={1}
            >
                {sector.sector}
            </Typography>

            <Typography variant="body2">
                <b>Investment</b>
            </Typography>

            <Typography
                color="primary"
                mb={1}
            >
                ₹{sector.invested_amount.toLocaleString("en-IN")}
            </Typography>

            <Typography variant="body2">
                <b>Holdings:</b> {sector.holdings}
            </Typography>

            <Typography
                mt={1}
                mb={0.5}
                fontWeight={600}
                variant="body2"
            >
                Companies
            </Typography>

            {sector.companies.map((company: string) => (

                <Typography
                    key={company}
                    variant="caption"
                    display="block"
                >
                    • {company}
                </Typography>

            ))}

        </Paper>

    );

};

// ==========================================================
// Component
// ==========================================================

export default function SectorPieChart() {

    const { data, isLoading } = useDashboard();

    if (isLoading || !data) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 280
                }}
            >
                Loading...
            </Box>

        );

    }

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 280
            }}
        >

            {/* ================= Pie ================= */}

            <Box
                sx={{
                    width: "65%",
                    height: "100%"
                }}
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie

                            data={data.sector_distribution}

                            dataKey="invested_amount"

                            nameKey="sector"

                            innerRadius={55}

                            outerRadius={90}

                            paddingAngle={3}

                            animationDuration={900}

                        >

                            {data.sector_distribution.map((_, index) => (

                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />

                            ))}

                        </Pie>

                        <Tooltip
                            content={<CustomTooltip />}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </Box>

            {/* ================= Legend ================= */}

            <Box
                sx={{
                    width: "35%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2
                }}
            >

                {data.sector_distribution.map((sector, index) => (

                    <Box
                        key={sector.sector}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >

                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                bgcolor: COLORS[index % COLORS.length],
                                borderRadius: 1,
                                flexShrink: 0
                            }}
                        />

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {sector.sector}
                        </Typography>

                    </Box>

                ))}

            </Box>

        </Box>

    );

}