import { getQRCode, getQRCodeAnalytics } from '@/app/actions/qr';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Monitor, Smartphone, Tablet, Activity } from 'lucide-react';
import styles from '../../admin.module.css';
import EditQRForm from './EditQRForm';
import ToggleQRStatus from './ToggleQRStatus';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default async function QRCodeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const qrCode = await getQRCode(id);
  
  if (!qrCode) {
    notFound();
  }

  const analytics = await getQRCodeAnalytics(id);
  
  const getDeviceIcon = (deviceType: string | null) => {
    if (deviceType === 'Mobile') return <Smartphone size={18} />;
    if (deviceType === 'Tablet') return <Tablet size={18} />;
    if (deviceType === 'Desktop') return <Monitor size={18} />;
    return <Activity size={18} />;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="title" style={{ margin: 0, fontSize: '1.8rem' }}>{qrCode.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <span className={`${styles.statusBadge} ${qrCode.isActive ? styles.statusActive : styles.statusInactive}`}>
                {qrCode.isActive ? 'Active' : 'Inactive'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                /q/{qrCode.slug}
              </span>
            </div>
          </div>
        </div>
        
        <ToggleQRStatus id={qrCode.id} initialStatus={qrCode.isActive} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Analytics Overview */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChartIcon /> Analytics Overview
            </h2>
            <div className={styles.statsGrid} style={{ marginBottom: 0 }}>
              <div className={`card ${styles.statCard}`} style={{ padding: '1.5rem' }}>
                <div className={styles.statTitle}>Total Scans</div>
                <div className={styles.statValue}>{analytics.totalScans}</div>
              </div>
              <div className={`card ${styles.statCard}`} style={{ padding: '1.5rem' }}>
                <div className={styles.statTitle}>Today</div>
                <div className={styles.statValue}>{analytics.todayScans}</div>
              </div>
              <div className={`card ${styles.statCard}`} style={{ padding: '1.5rem' }}>
                <div className={styles.statTitle}>This Week</div>
                <div className={styles.statValue}>{analytics.weekScans}</div>
              </div>
              <div className={`card ${styles.statCard}`} style={{ padding: '1.5rem' }}>
                <div className={styles.statTitle}>This Month</div>
                <div className={styles.statValue}>{analytics.monthScans}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Device Breakdown */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Device Breakdown</h2>
              {analytics.deviceStats.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No data yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analytics.deviceStats.map(stat => (
                    <div key={stat.deviceType || 'unknown'} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        {getDeviceIcon(stat.deviceType)}
                        {stat.deviceType || 'Unknown'}
                      </div>
                      <div style={{ fontWeight: 600 }}>{stat._count} scans</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Scans */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Recent Scans</h2>
              {analytics.recentScans.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No scans yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analytics.recentScans.slice(0, 5).map(scan => (
                    <div key={scan.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.75rem 0', borderBottom: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Calendar size={14} />
                        {new Date(scan.scannedAt).toLocaleString()}
                      </div>
                      <div>
                        {scan.deviceType || 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Edit Details</h2>
            <EditQRForm qrCode={qrCode} />
          </div>

        </div>

        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>QR Code</h2>
            <QRCodeDisplay slug={qrCode.slug} name={qrCode.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}
