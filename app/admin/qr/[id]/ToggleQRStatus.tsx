'use client';

import { useState } from 'react';
import { toggleQRCodeStatus, deleteQRCode } from '@/app/actions/qr';
import { useRouter } from 'next/navigation';
import { Power, PowerOff, Trash2 } from 'lucide-react';

interface Props {
  id: string;
  initialStatus: boolean;
}

export default function ToggleQRStatus({ id, initialStatus }: Props) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await toggleQRCodeStatus(id, !isActive);
      if (res.success) {
        setIsActive(!isActive);
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this QR code? This action cannot be undone and will delete all scan analytics.')) {
      setIsLoading(true);
      try {
        const res = await deleteQRCode(id);
        if (res.success) {
          router.push('/admin');
        }
      } catch (err) {
        alert('Failed to delete QR code');
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button 
        onClick={handleToggle}
        disabled={isLoading}
        className={`btn ${isActive ? 'btn-outline' : 'btn-primary'}`}
        style={{ borderColor: isActive ? 'var(--danger)' : undefined, color: isActive ? 'var(--danger)' : undefined }}
      >
        {isActive ? <><PowerOff size={18} /> Disable QR</> : <><Power size={18} /> Enable QR</>}
      </button>
      
      <button 
        onClick={handleDelete}
        disabled={isLoading}
        className="btn btn-outline"
        style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '0.75rem' }}
        title="Delete QR Code"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
