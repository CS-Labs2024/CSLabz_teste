import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConfigProvider } from './contexts/ConfigProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import { ClientDataProvider } from './contexts/ClientDataContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import EmailVerification from './pages/EmailVerification';
import AuthCallback from './pages/AuthCallback';
import CohortAnalysis from './pages/CohortAnalysis';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RiskManagement from './pages/RiskManagement';
import Cobertura from './pages/Cobertura';
import Pricing from './pages/Pricing';
import RFVAnalysis from './pages/RFVAnalysis';
import ClientTable from './pages/ClientTable';
import Checkout from './pages/Checkout';
import StripeProvider from './components/StripeProvider';
import SubscriptionInfo from './pages/Dashboard/SubscriptionInfo';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ClientDataProvider>
                <StripeProvider>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<SignUp />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/update-password" element={<UpdatePassword />} />
                    <Route path="/auth/verify" element={<EmailVerification />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                      <Route index element={<Navigate to="/dashboard/clients" replace />} />
                      <Route path="clients" element={<ClientTable />} />
                      <Route path="cohort" element={<CohortAnalysis />} />
                      <Route path="risk" element={<RiskManagement />} />
                      <Route path="coverage" element={<Cobertura />} />
                      <Route path="rfv" element={<RFVAnalysis />} />
                      <Route path="subscription" element={<SubscriptionInfo />} />
                      <Route
                        path="import"
                        element={<div>Importar Base - Em desenvolvimento</div>}
                      />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </StripeProvider>
              </ClientDataProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}