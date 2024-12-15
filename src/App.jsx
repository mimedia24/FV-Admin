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
import MenuManagement from "./pages/menuManagement";
import UserManagement from "./pages/userManagement";
import { Toaster } from "react-hot-toast";
import RestaurantListOfMenu from "./pages/restaurantListOfMenu";
import CategoryManagement from "./pages/categoryManagement";
import Offermanagement from "./pages/Offermanagement";
import Settings from "./pages/Settings";
import Charges from "./pages/Charges";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />

      <Toaster position="top-center" />

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
              path="/charges"
              element={
                <ProtectedRoute>
                  <Charges />
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
              path="/category-management"
              element={
                <ProtectedRoute>
                  <CategoryManagement />
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
            <Route
              path="/menu-management"
              element={
                <ProtectedRoute>
                  <MenuManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/menu-list/:id"
              element={
                <ProtectedRoute>
                  <RestaurantListOfMenu />
                </ProtectedRoute>
              }
            />

            <Route
              path="/offer-management"
              element={
                <ProtectedRoute>
                  <Offermanagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
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
