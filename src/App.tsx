import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { useAuth } from "./contexts/AuthContext";


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
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
            </Routes>
        </BrowserRouter>
    )
}

// Protected Route Provides Loading & Route Protecting/Redirection (If No User Signed In)
function ProtectedRoute ({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();

    if (authState.loading) { return <div>Loading...</div> };

    if (!authState.user) { return <Navigate to='/auth' replace /> };

    return <>{children}</>
}