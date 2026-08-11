'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQRCode } from '@/app/actions/qr';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { QRCode } from '@/app/generated/prisma/client';

export default function CreateQRCodePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdQR, setCreatedQR] = useState<QRCode | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    destinationUrl: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await createQRCode(formData);
      if (res.success && res.qrCode) {
        setCreatedQR(res.qrCode as QRCode);
      } else {
        setError('Failed to create QR code.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the QR code.');
    } finally {
      setIsLoading(false);
    }
  };

  if (createdQR) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-outline" onClick={() => {
            setCreatedQR(null);
            setFormData({ name: '', destinationUrl: '', description: '' });
          }}>
            <ArrowLeft size={18} /> Generate Another
          </button>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>QR Code Created Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{createdQR.name}</p>
          
          <QRCodeDisplay slug={createdQR.slug} name={createdQR.name} />
          
          <div style={{ marginTop: '2rem' }}>
            <Link href={`/admin/qr/${createdQR.id}`} className="btn btn-primary">
              View Analytics Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className="title" style={{ margin: 0 }}>Create New QR Code</h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">QR Code Name (e.g. Community Services Form)</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter a descriptive name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">Destination URL</label>
            <input
              id="url"
              type="url"
              value={formData.destinationUrl}
              onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
              placeholder="https://example.com/form"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="desc">Campaign / Description (Optional)</label>
            <input
              id="desc"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. August Outreach"
            />
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link href="/admin" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
