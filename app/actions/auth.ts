'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || password !== adminPassword) {
    return { success: false, error: 'Invalid password' };
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}
