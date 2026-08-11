'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, LayoutDashboard, PlusCircle, LogOut } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <QrCode className={styles.logo} />
          <h2>QR System</h2>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/create" className={`${styles.navLink} ${pathname === '/admin/create' ? styles.active : ''}`}>
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
