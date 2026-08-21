import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
    createTheme({

        palette: {

            mode,

            primary: {

                main: "#1565C0",

            },

            secondary: {

                main: "#2E7D32",

            },

            background: {

                default:

                    mode === "light"

                        ? "#F4F6F8"

                        : "#121212",

                paper:

                    mode === "light"

                        ? "#FFFFFF"

                        : "#1E1E1E"

            }

        },

        typography: {

            fontFamily: "Inter, Roboto, Arial, sans-serif",

            h4: {

                fontWeight: 700

            },

            h5: {

                fontWeight: 700

            },

            h6: {

                fontWeight: 600

            }

        },

        shape: {

            borderRadius: 12

        },

        components: {

            MuiPaper: {

                styleOverrides: {

                    root: {

                        transition: "all .3s"

                    }

                }

            },

            MuiButton: {

                styleOverrides: {

                    root: {

                        borderRadius: 10,

                        textTransform: "none"

                    }

                }

            }

        }

    });