import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardOverview from "./pages/DashboardOverview";
import BugReportsList from "./pages/BugReportsList";
import BugReportDetail from "./pages/BugReportDetail";
import MetricsPage from "./pages/MetricsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { isAuthenticated, logout } from "./api/auth";

function Navbar({ authed, onLogout }) {
  const location = useLocation();
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-left">
        <Link to="/dashboard" className="brand">
          Bug Detector
        </Link>
        {authed && (
          <>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
              Overview
            </Link>
            <Link to="/reports" className={location.pathname.startsWith("/reports") ? "active" : ""}>
              Reports
            </Link>
            <Link to="/metrics" className={location.pathname === "/metrics" ? "active" : ""}>
              Metrics
            </Link>
            <Link to="/notifications" className={location.pathname === "/notifications" ? "active" : ""}>
              Notifications
            </Link>
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
              Profile
            </Link>
            <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
              Settings
            </Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {!authed ? (
          <>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
              Login
            </Link>
            <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>
              Register
            </Link>
          </>
        ) : (
          <button className="btn" onClick={onLogout} aria-label="Logout">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  /** Root application with routes and auth-aware navigation. */
  const [authed, setAuthed] = useState(isAuthenticated());
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const onLogout = () => {
    logout();
    setAuthed(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar authed={authed} onLogout={onLogout} />
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />
              <Route path="/login" element={<LoginPage onAuthed={() => setAuthed(true)} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <BugReportsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                    <BugReportDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metrics"
                element={
                  <ProtectedRoute>
                    <MetricsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </div>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
