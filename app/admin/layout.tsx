'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, LayoutDashboard, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.logoWrapper}>
          <QrCode className={styles.logo} />
          <h2>QR System</h2>
        </div>
        <button className={styles.menuBtn} onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.sidebarOverlay} onClick={closeMenu} />
      )}

      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <QrCode className={styles.logo} />
          <h2>QR System</h2>
          <button className={styles.closeBtn} onClick={closeMenu}>
            <X size={24} />
          </button>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`} onClick={closeMenu}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/create" className={`${styles.navLink} ${pathname === '/admin/create' ? styles.active : ''}`} onClick={closeMenu}>
            <PlusCircle size={20} />
            Create QR
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.logoutBtn}
            onClick={async () => {
              const { logout } = await import('@/app/actions/auth');
              await logout();
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
