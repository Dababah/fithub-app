import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Import Komponen Navigasi dan Halaman
import AppNavbar from "./components/common/Navbar";
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/Auth/loginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import MemberDashboard from "./pages/Member/MemberDashboard";
import CheckInPage from "./pages/Member/CheckInPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageMembersPage from "./pages/Admin/ManageMembersPage";

// Gaya CSS untuk layout
const layoutStyles = {
  mainContent: {
    paddingTop: "70px", // Padding untuk mengakomodasi navbar
    minHeight: "100vh", // Memastikan konten mengisi seluruh viewport
  },
};

// Layout untuk halaman publik
const PublicLayout = ({ children }) => (
  <>
    <AppNavbar />
    <div style={layoutStyles.mainContent}>
      {children}
    </div>
  </>
);

// Layout untuk halaman dashboard
const DashboardLayout = ({ children }) => (
  <>
    <AppNavbar />
    <div style={layoutStyles.mainContent}>
      {children}
    </div>
  </>
);

// PrivateRoute untuk melindungi rute berdasarkan role
function PrivateRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    const redirectPath = user.role === "admin" ? "/admin" : "/member";
    return <Navigate to={redirectPath} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  const { user } = useAuth(); 

  return (
    <Routes>
      {/* Rute Publik */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/member"} replace />
          ) : (
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          )
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <RegisterPage />
          </PublicLayout>
        }
      />

      {/* Rute Member */}
      <Route
        path="/member"
        element={
          <PrivateRoute allowedRole="member">
            <MemberDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/member/checkin"
        element={
          <PrivateRoute allowedRole="member">
            <CheckInPage />
          </PrivateRoute>
        }
      />

      {/* Rute Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <PrivateRoute allowedRole="admin">
            <ManageMembersPage />
          </PrivateRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
  
}