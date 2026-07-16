import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./Layout";

import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Results from "./pages/Results";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/upload" element={<Upload />} />

                <Route path="/results" element={<Results />} />
            </Route>
        </Routes>
    );
}

export default App;