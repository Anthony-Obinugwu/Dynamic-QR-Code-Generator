'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../actions/auth';
import { Lock } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await login(password);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`card ${styles.loginCard}`}>
        <div className={styles.iconWrapper}>
          <Lock size={32} className={styles.icon} />
        </div>
        <h1 className="title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Admin Access</h1>
        <p className={styles.subtitle}>Enter your password to manage QR codes.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              required
              autoFocus
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
