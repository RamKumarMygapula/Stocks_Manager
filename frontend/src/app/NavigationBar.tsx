import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Typography
} from "@mui/material";

interface Props {
    activeTab: string;
    onChange: (tab: string) => void;
}

const tabs = [
    "Home",
    "Analysis",
    "Prediction",
    "IPO",
    "Logs"
];

export default function NavigationBar({
    activeTab,
    onChange
}: Props) {

    return (

        <AppBar
            position="sticky"
            elevation={1}
            color="default"
        >

            <Toolbar
                sx={{
                    minHeight: 64,
                    px: {
                        xs: 2,
                        md: 4
                    }
                }}
            >

                {/* Application Name */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mr: {
                            xs: 2,
                            md: 5
                        },
                        whiteSpace: "nowrap"
                    }}
                >
                    📈 Stock Manager
                </Typography>

                {/* Navigation */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: {
                            xs: 0.5,
                            md: 1
                        },
                        overflowX: "auto",
                        flex: 1
                    }}
                >

                    {tabs.map((tab) => (

                        <Button
                            key={tab}
                            onClick={() => onChange(tab)}
                            sx={{
                                minWidth: "auto",
                                px: {
                                    xs: 1.2,
                                    md: 2
                                },
                                py: 1,
                                borderRadius: 2,
                                fontWeight:
                                    activeTab === tab
                                        ? 700
                                        : 500,
                                color:
                                    activeTab === tab
                                        ? "primary.main"
                                        : "text.secondary",
                                backgroundColor:
                                    activeTab === tab
                                        ? "action.selected"
                                        : "transparent",
                                "&:hover": {
                                    backgroundColor:
                                        "action.hover"
                                }
                            }}
                        >
                            {tab}
                        </Button>

                    ))}

                </Box>

            </Toolbar>

        </AppBar>

    );

}