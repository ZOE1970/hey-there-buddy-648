import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReview from "./pages/AdminReview";
import ComplianceForm from "./pages/ComplianceForm";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import CertificateViewer from "./pages/CertificateViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/form" element={<ComplianceForm />} />
          <Route path="/vendor/submission-success" element={<SubmissionSuccess />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/review/:id" element={<AdminReview />} />
          <Route path="/certificate/:id" element={<CertificateViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
