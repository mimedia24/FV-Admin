import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./useAuth/useAuth";
import ProtectedRoute from "./protectedRoute/protectedRoute";
import OrderManagement from "./pages/orderManagement";
import RiderManagement from "./pages/riderManagement";
import RestrauntManagement from "./pages/restrauntManagement";
import NotFound from "./pages/notFound";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-management"
              element={
                <ProtectedRoute>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rider-management"
              element={
                <ProtectedRoute>
                  <RiderManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/restaurant-management"
              element={
                <ProtectedRoute>
                  <RestrauntManagement />
                </ProtectedRoute>
              }
            />

            {/* not found page */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
