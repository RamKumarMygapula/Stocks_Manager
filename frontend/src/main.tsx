import React from "react";
import ReactDOM from "react-dom/client";

import AppThemeProvider from "./app/ThemeContext";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./app/App";

// =============================================================================
// React Query Client
// =============================================================================

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(

    <React.StrictMode>

        <QueryClientProvider client={queryClient}>

            <AppThemeProvider>

                <App />

            </AppThemeProvider>

        </QueryClientProvider>

    </React.StrictMode>

);