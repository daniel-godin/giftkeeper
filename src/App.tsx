import { BrowserRouter, Route, Routes } from "react-router";
import { LandingPage } from "./pages/LandingPage/LandingPage";


export function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Basic Redirect Route */}
                <Route path="*" element={<LandingPage />} />

                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    )
}
