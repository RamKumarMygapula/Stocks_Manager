import {
    Paper,
    Typography,
    Box
} from "@mui/material";

interface Props {

    title: string;

    value: string | number;

    subtitle?: string;

    color?: string;

    icon?: React.ReactNode;

}

export default function SummaryCard({

    title,

    value,

    subtitle,

    color = "#1976D2",

    icon

}: Props) {

    return (

        <Paper

            elevation={2}

            sx={{

                p: 2,

                borderRadius: 2.5,

                borderLeft: `5px solid ${color}`,

                transition: "all .25s",

                cursor: "default",

                "&:hover": {

                    transform: "translateY(-5px)",

                    boxShadow: 6

                }

            }}

        >

            <Box

                display="flex"

                justifyContent="space-between"

                alignItems="center"

                mb={1.2}

            >

                <Typography

                    variant="body2"

                    color="text.secondary"

                    fontWeight={600}

                >

                    {title}

                </Typography>

                {icon && (

                    <Box

                        sx={{

                            width: 36,

                            height: 36,

                            borderRadius: "50%",

                            backgroundColor: `${color}20`,

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            color

                        }}

                    >

                        {icon}

                    </Box>

                )}

            </Box>

            <Typography

                variant="h6"
                

                fontWeight={700}

                sx={{

                    color,
                    fontSize: "1.45rem",
                    mb: .5

                }}

            >

                {value}

            </Typography>

            {subtitle && (

                <Typography

                    variant="caption"

                    color="text.secondary"

                >

                    {subtitle}

                </Typography>

            )}

        </Paper>

    );

}