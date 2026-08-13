import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import type { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OwnerDashboard from './pages/OwnerDashboard';
import TenantDashboard from './pages/TenantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import OwnerPropertiesPage from './pages/OwnerPropertiesPage';
import OwnerInterestedPage from './pages/OwnerInterestedPage';
import OwnerProfilePage from './pages/OwnerProfilePage';
import AdminPendingListingsPage from './pages/AdminPendingListingsPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ role, children }: { role: string; children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto mt-24 max-w-3xl rounded-3xl bg-white/90 p-10 text-center shadow-glass">Loading your experience…</div>;
  }
  if (!user) return <Navigate to={`/${role}/login`} replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/owner/login" element={<LoginPage role="owner" />} />
            <Route path="/tenant/login" element={<LoginPage role="tenant" />} />
            <Route path="/admin/login" element={<LoginPage role="admin" />} />
            <Route path="/owner/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/tenant/dashboard" element={<ProtectedRoute role="tenant"><TenantDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/owner/add-property" element={<ProtectedRoute role="owner"><AddPropertyPage /></ProtectedRoute>} />
            <Route path="/owner/properties/:id/edit" element={<ProtectedRoute role="owner"><EditPropertyPage /></ProtectedRoute>} />
            <Route path="/owner/properties" element={<ProtectedRoute role="owner"><OwnerPropertiesPage /></ProtectedRoute>} />
            <Route path="/owner/profile" element={<ProtectedRoute role="owner"><OwnerProfilePage /></ProtectedRoute>} />
            <Route path="/owner/interested" element={<ProtectedRoute role="owner"><OwnerInterestedPage /></ProtectedRoute>} />
            <Route path="/admin/pending-listings" element={<ProtectedRoute role="admin"><AdminPendingListingsPage /></ProtectedRoute>} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
