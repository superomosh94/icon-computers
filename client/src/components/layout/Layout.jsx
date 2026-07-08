import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import StickyCallButton from './StickyCallButton';

export default function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </main>
      <Footer />
      <StickyCallButton />
    </>
  );
}
