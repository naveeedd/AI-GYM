import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ShoppingCartProvider } from "./contexts/ShoppingCartContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import LandingPage from "./pages/public/LandingPage";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserSubscription from "./pages/user/UserSubscription";
import UserAttendance from "./pages/user/UserAttendance";
import UserProducts from "./pages/user/UserProducts";
import UserDietPlans from "./pages/user/UserDietPlans";
import UserWorkoutTutorials from "./pages/user/UserWorkoutTutorials";
import UserProfile from "./pages/user/UserProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminFinancials from "./pages/admin/AdminFinancials";

// Protected routes
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import SubscriptionCheck from "./components/auth/SubscriptionCheck";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ShoppingCartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<SignUp />} />
                </Route>

                {/* User routes - Subscription not required for this route */}
                <Route path="/user/subscription" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<UserSubscription />} />
                </Route>

                {/* User routes - Require subscription */}
                <Route path="/user" element={
                  <ProtectedRoute>
                    <SubscriptionCheck>
                      <DashboardLayout />
                    </SubscriptionCheck>
                  </ProtectedRoute>
                }>
                  <Route index element={<UserDashboard />} />
                  <Route path="attendance" element={<UserAttendance />} />
                  <Route path="products" element={<UserProducts />} />
                  <Route path="diet-plans" element={<UserDietPlans />} />
                  <Route path="workout-tutorials" element={<UserWorkoutTutorials />} />
                  <Route path="profile" element={<UserProfile />} />
                </Route>

                {/* Admin routes - Pure admin layout without subscription checks */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="attendance" element={<AdminAttendance />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="members" element={<AdminMembers />} />
                  <Route path="financials" element={<AdminFinancials />} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ShoppingCartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
