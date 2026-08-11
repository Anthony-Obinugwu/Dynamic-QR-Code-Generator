import Link from 'next/link';
import { getQRCodes } from '@/app/actions/qr';
import { BarChart, Edit, ExternalLink, Power, PowerOff } from 'lucide-react';
import styles from './admin.module.css';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const qrCodes = await getQRCodes();
  
  const totalCodes = qrCodes.length;
  const activeCodes = qrCodes.filter(c => c.isActive).length;
  const totalScans = qrCodes.reduce((sum, c) => sum + c.scanCount, 0);

  // Get today's scans across all codes
  const todayScans = await prisma.qRScan.count({
    where: {
      scannedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  return (
    <div>
      <h1 className="title">Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statTitle}>Total QR Codes</div>
          <div className={styles.statValue}>{totalCodes}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statTitle}>Active Codes</div>
          <div className={styles.statValue}>{activeCodes}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statTitle}>Total Scans</div>
          <div className={styles.statValue}>{totalScans}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statTitle}>Scans Today</div>
          <div className={styles.statValue}>{todayScans}</div>
        </div>
      </div>

      <div className="card">
        <div className={styles.tableHeader}>
          <h2>Generated QR Codes</h2>
          <Link href="/admin/create" className="btn btn-primary">
            Create New
          </Link>
        </div>
        
        {qrCodes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No QR codes generated yet. Click "Create New" to get started.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Destination</th>
                  <th>Scans</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {qrCodes.map((qr) => (
                  <tr key={qr.id}>
                    <td data-label="Name">
                      <div style={{ fontWeight: 500 }}>{qr.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/q/{qr.slug}</div>
                    </td>
                    <td data-label="Destination">
                      <a href={qr.destinationUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {qr.destinationUrl.length > 30 ? qr.destinationUrl.substring(0, 30) + '...' : qr.destinationUrl}
                        <ExternalLink size={14} />
                      </a>
                    </td>
                    <td data-label="Scans">{qr.scanCount}</td>
                    <td data-label="Status">
                      <span className={`${styles.statusBadge} ${qr.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {qr.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td data-label="Created">
                      {new Date(qr.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="Actions">
                      <div className={styles.actionLinks}>
                        <Link href={`/admin/qr/${qr.id}`} className={styles.actionBtn} title="Analytics & Edit">
                          <BarChart size={18} />
                        </Link>
                        {/* More actions can be placed in the details view to keep it clean */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
