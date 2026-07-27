import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./map.css";
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
import PaymentManagement from "./pages/PaymentManagement";
import Notification from "./pages/Notification";
import AllNotification from "./pages/AllNotification";
import RegisterNewRider from "./pages/rider/RegisterNewRider";
import WithdrawList from "./pages/rider/WithdrawList";
import CollectionPaymentList from "./pages/rider/CollectionPaymentList";
import OrderMap from "./pages/OrderMap";
import RestaurantTransaction from "./pages/RestaurantTransaction";
import OrderHistoryScreen from "./pages/OrdeHistoryScreen";
import ZoneManagementScreen from "./pages/ZoneManagement";
import ManualDiscountRequests from "./pages/ManualDiscountRequests";
import ProfitReports from "./pages/ProfitReports";
import BkashLedger from "./pages/BkashLedger";
import OrderTrash from "./pages/OrderTrash";
import AppUpdateControl from "./pages/AppUpdateControl";

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
              path="/payment/:payment"
              element={
                <ProtectedRoute>
                  <PaymentManagement />
                </ProtectedRoute>
              }
            />
            {/* rider start*/}
            <Route
              path="/rider-management"
              element={
                <ProtectedRoute>
                  <RiderManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider-management/register"
              element={
                <ProtectedRoute>
                  <RegisterNewRider />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider-management/withdraw-list"
              element={
                <ProtectedRoute>
                  <WithdrawList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider-management/collection-payment-list"
              element={
                <ProtectedRoute>
                  <CollectionPaymentList />
                </ProtectedRoute>
              }
            />
            {/* rider end */}
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
              path="/restaurant/transactions"
              element={
                <ProtectedRoute>
                  <RestaurantTransaction />
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
            <Route
              path="/notification"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification/all"
              element={
                <ProtectedRoute>
                  <AllNotification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-map"
              element={
                <ProtectedRoute>
                  <OrderMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
                        />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                <ProfitReports />
                </ProtectedRoute>
              }
            />            

            <Route
              path="/zone-management"
              element={
                <ProtectedRoute>
                  <ZoneManagementScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app-update"
              element={
                <ProtectedRoute>
                  <AppUpdateControl />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-trash"
              element={
                <ProtectedRoute>
                  <OrderTrash />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bkash-ledger"
              element={
                <ProtectedRoute>
                  <BkashLedger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manual-discounts"
              element={
                <ProtectedRoute>
                <ManualDiscountRequests />
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
