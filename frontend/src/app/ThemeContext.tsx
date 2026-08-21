import {

    createContext,

    useMemo,

    useState,

    useEffect

} from "react";

import {

    ThemeProvider,

    CssBaseline

} from "@mui/material";

import { getTheme } from "./theme";

export const ThemeModeContext = createContext({

    toggleTheme: () => {}

});

export default function AppThemeProvider({

    children

}: {

    children: React.ReactNode

}) {

    const [mode, setMode] = useState<"light" | "dark">(

        () =>

            (localStorage.getItem("theme") as "light" | "dark") ||

            "light"

    );

    useEffect(() => {

        localStorage.setItem(

            "theme",

            mode

        );

    }, [mode]);

    const theme = useMemo(

        () => getTheme(mode),

        [mode]

    );

    return (

        <ThemeModeContext.Provider

            value={{

                toggleTheme: () =>

                    setMode(

                        prev =>

                            prev === "light"

                                ? "dark"

                                : "light"

                    )

            }}

        >

            <ThemeProvider theme={theme}>

                <CssBaseline />

                {children}

            </ThemeProvider>

        </ThemeModeContext.Provider>

    );

}