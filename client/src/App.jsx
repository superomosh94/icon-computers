import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import CartPage from './pages/CartPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AddLaptopPage from './pages/admin/AddLaptopPage';
import EditLaptopPage from './pages/admin/EditLaptopPage';
import ProductsPage from './pages/admin/ProductsPage';
import SiteContentPage from './pages/admin/SiteContentPage';
import ShopSettingsPage from './pages/admin/ShopSettingsPage';
import BestDealsPage from './pages/admin/BestDealsPage';
import FlashSalesPage from './pages/admin/FlashSalesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer-facing routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/laptop/:slug" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/add" element={<AddLaptopPage />} />
          <Route path="/admin/edit/:id" element={<EditLaptopPage />} />
          <Route path="/admin/site-content" element={<SiteContentPage />} />
          <Route path="/admin/shop-settings" element={<ShopSettingsPage />} />
          <Route path="/admin/best-deals" element={<BestDealsPage />} />
          <Route path="/admin/flash-sales" element={<FlashSalesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
