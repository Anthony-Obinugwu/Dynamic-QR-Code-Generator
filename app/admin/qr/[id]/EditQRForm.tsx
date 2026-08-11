'use client';

import { useState } from 'react';
import { updateQRCode } from '@/app/actions/qr';
import { QRCode } from '@/app/generated/prisma/client';
import { Save } from 'lucide-react';

interface Props {
  qrCode: QRCode;
}

export default function EditQRForm({ qrCode }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: qrCode.name,
    destinationUrl: qrCode.destinationUrl,
    description: qrCode.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await updateQRCode(qrCode.id, formData);
      if (res.success) {
        setMessage({ text: 'Changes saved successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="edit-name">Name</label>
        <input
          id="edit-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-url">Destination URL</label>
        <input
          id="edit-url"
          type="url"
          value={formData.destinationUrl}
          onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
          required
        />
        <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Changing this will update where the QR code redirects, but the printed QR code will remain the same.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="edit-desc">Description</label>
        <input
          id="edit-desc"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {message.text && (
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }}>
          {message.text}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
        <Save size={18} />
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
