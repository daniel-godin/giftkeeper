import { BrowserRouter, Route, Routes } from "react-router";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Dashboard } from "./pages/Dashboard/Dashboard";


export function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Basic Redirect Route */}
                <Route path="*" element={<LandingPage />} />

                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                
            </Routes>
        </BrowserRouter>
    )
}
