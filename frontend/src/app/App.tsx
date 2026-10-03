import { useState } from "react";

import NavigationBar from "./NavigationBar";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AnalysisPage from "../features/analysis/pages/AnalysisPage";
import PredictionPage from "../features/prediction/pages/PredictionPage";
import IpoPage from "../features/ipo/pages/IpoPage";
//import LogsPage from "../features/logs/pages/LogsPage";

export default function App() {

    const [activeTab, setActiveTab] = useState("Home");

    const renderPage = () => {

        switch (activeTab) {

            case "Analysis":
                return <AnalysisPage />;

            case "Prediction":
                return <PredictionPage />;

            case "IPO":
                return <IpoPage />;

            case "Logs":
                return <LogsPage />;

            case "Home":
            default:
                return <DashboardPage />;

        }

    };

    return (

        <>
            <NavigationBar
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {renderPage()}
        </>

    );

}