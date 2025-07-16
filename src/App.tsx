import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { useAuth } from "./contexts/AuthContext";
import { Layout } from "./layouts/Layout";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { PeoplePage } from "./pages/PeoplePage/PeoplePage";
import { EventsPage } from "./pages/EventsPage/EventsPage";
import { GiftListsPage } from "./pages/GiftListsPage/GiftListsPage";
import { WishListsPage } from "./pages/WishListsPage/WishListsPage";
import { PersonPage } from "./pages/PersonPage/PersonPage";
import { EventPage } from "./pages/EventPage/EventPage";
import { GiftListPage } from "./pages/GiftListPage/GiftListPage";
import { WishListPage } from "./pages/WishListPage/WishListPage";
import { DataProvider } from "./contexts/DataProvider";

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
                    <Route path="profile" element={<ProfilePage />} />

                    <Route path="people" element={<PeoplePage />} />
                    <Route path="people/:personId" element={<PersonPage />} />

                    <Route path="events" element={<EventsPage />} />
                    <Route path="events/:eventId" element={<EventPage />} />

                    <Route path="gift-lists" element={<GiftListsPage />} />
                    <Route path="gift-lists/:giftListId" element={<GiftListPage />} />

                    {/* // ARCHIVED: Wish Lists feature temporarily disabled
                    // TODO: Re-enable after core gift tracking is polished */}
                    {/* <Route path="wish-lists" element={<WishListsPage />} />
                    <Route path="wish-lists/:wishListId" element={<WishListPage />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

// Protected Route Provides Loading & Route Protecting/Redirection (If No User Signed In)
function ProtectedRoute () {
    const { authState } = useAuth();

    // Loading & Guard Clauses:
    if (authState.loading) { return <div>Loading...</div> };
    if (!authState.user) { return <Navigate to='/auth' replace /> };

    return (
        <DataProvider>
            <Layout />
        </DataProvider>
    )
}