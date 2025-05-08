import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { useAuth } from "./contexts/AuthContext";
import { Layout } from "./layouts/Layout";


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
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardPage />} />

                </Route>
                
            </Routes>
        </BrowserRouter>
    )
}

// Protected Route Provides Loading & Route Protecting/Redirection (If No User Signed In)
function ProtectedRoute () {

    const { authState } = useAuth();

    if (authState.loading) { return <div>Loading...</div> };

    if (!authState.user) { return <Navigate to='/auth' replace /> };

    return <Layout />
}