'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  slug: string;
  name: string;
}

export default function QRCodeDisplay({ slug, name }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const fullUrl = `${window.location.origin}/q/${slug}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f111a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      });
      
      QRCode.toDataURL(fullUrl, {
        width: 1000, // High res for download
        margin: 2,
        errorCorrectionLevel: 'H'
      }).then(url => setQrDataUrl(url));
    }
  }, [fullUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={handleDownload}>
          <Download size={18} />
          Download PNG
        </button>
        <button className="btn btn-outline" onClick={handleCopy}>
          {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
      
      <div style={{ background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {fullUrl}
      </div>
    </div>
  );
}
