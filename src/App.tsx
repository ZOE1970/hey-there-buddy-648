import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReview from "./pages/AdminReview";
import UserManagement from "./pages/UserManagement";
import ComplianceForm from "./pages/ComplianceForm";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import CertificateViewer from "./pages/CertificateViewer";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import LegalDashboard from "./pages/LegalDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Component to conditionally render the footer
const AppContent = () => {
  const location = useLocation();
  const hideFooterPaths = ['/login']; // Add signup path if needed
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Vendor Routes */}
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute requiredRole="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/vendor/form" element={
            <ProtectedRoute requiredRole="vendor">
              <ComplianceForm />
            </ProtectedRoute>
          } />
          <Route path="/vendor/submission-success" element={
            <ProtectedRoute requiredRole="vendor">
              <SubmissionSuccess />
            </ProtectedRoute>
          } />
          
          {/* Protected Superadmin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/review/:vendorSlug" element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminReview />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="superadmin">
              <UserManagement />
            </ProtectedRoute>
          } />
          
          {/* Protected Legal Routes */}
          <Route path="/legal/dashboard" element={
            <ProtectedRoute requiredRole="legal">
              <LegalDashboard />
            </ProtectedRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/certificate/:id" element={<CertificateViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;