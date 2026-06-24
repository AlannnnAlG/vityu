import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';

// ─── Layout Dasbor ────────────────────────────────────────────────────────────
import DasborLayout from '@/components/DasborLayout.jsx';

// ─── Halaman Vityuu (tidak diubah) ────────────────────────────────────────────
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';

// ─── Admin Pages ───────────────────────────────────────────────────────────────
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminBlogPage from './pages/AdminBlogPage.jsx';
import AdminBlogFormPage from './pages/AdminBlogFormPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminOrderInvoicePage from './pages/AdminOrderInvoicePage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';

// ─── Halaman Dasbor ────────────────────────────────────────────────────────────
import DasborHomePage from './pages/DasborHomePage.jsx';
import CravingTrackerPage from './pages/CravingTrackerPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import ReferralPage from './pages/ReferralPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* ── Public Routes (vityuu) ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:productId" element={<ProductDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Authenticated User Routes (vityuu) ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          </Route>

          {/* ── Admin Routes (vityuu) ── */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/admin/blog/new" element={<AdminBlogFormPage />} />
            <Route path="/admin/blog/:id/edit" element={<AdminBlogFormPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id/invoice" element={<AdminOrderInvoicePage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* ── DASBOR ROUTES ── */}
          {/* Semua halaman dasbor dibungkus DasborLayout yang punya tombol Back ke Vityuu */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dasbor" element={
              <DasborLayout><DasborHomePage /></DasborLayout>
            } />

            <Route path="/tracker" element={
              <DasborLayout><CravingTrackerPage /></DasborLayout>
            } />

            <Route path="/insights" element={
              <DasborLayout><InsightsPage /></DasborLayout>
            } />

            <Route path="/rewards" element={
              <DasborLayout><RewardsPage /></DasborLayout>
            } />

            <Route path="/referral" element={
              <DasborLayout><ReferralPage /></DasborLayout>
            } />

            <Route path="/education" element={
              <DasborLayout><EducationPage /></DasborLayout>
            } />

            <Route path="/dasbor-profile" element={
              <DasborLayout><ProfilePage /></DasborLayout>
            } />

            <Route path="/confirmation" element={
              <DasborLayout><OrderConfirmationPage /></DasborLayout>
            } />

            <Route path="/history" element={
              <DasborLayout><OrderHistoryPage /></DasborLayout>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Halaman tidak ditemukan</p>
      <a href="/" className="btn-primary inline-block">Kembali ke Beranda</a>
    </div>
  </div>
);

export default App;