import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import { AdminLayout } from "./components/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/Overview.tsx";
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import AdminSkills from "./pages/admin/AdminSkills.tsx";
import AdminProjects from "./pages/admin/AdminProjects.tsx";
import AdminServices from "./pages/admin/AdminServices.tsx";
import AdminMessages from "./pages/admin/AdminMessages.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
