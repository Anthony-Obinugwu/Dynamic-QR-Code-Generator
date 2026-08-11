'use server';

import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Helper to check authentication in server actions
async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

export async function createQRCode(data: { name: string; destinationUrl: string; description?: string }) {
  await requireAuth();

  try {
    // Basic validation
    new URL(data.destinationUrl); // Will throw if invalid URL
  } catch (e) {
    throw new Error('Invalid destination URL');
  }

  // Generate unique slug
  let slug = nanoid(6);
  // Ensure uniqueness
  while (await prisma.qRCode.findUnique({ where: { slug } })) {
    slug = nanoid(6);
  }

  const qrCode = await prisma.qRCode.create({
    data: {
      name: data.name,
      destinationUrl: data.destinationUrl,
      description: data.description || null,
      slug,
    },
  });

  revalidatePath('/admin');
  return { success: true, qrCode };
}

export async function updateQRCode(id: string, data: { name: string; destinationUrl: string; description?: string }) {
  await requireAuth();

  try {
    new URL(data.destinationUrl);
  } catch (e) {
    throw new Error('Invalid destination URL');
  }

  const qrCode = await prisma.qRCode.update({
    where: { id },
    data: {
      name: data.name,
      destinationUrl: data.destinationUrl,
      description: data.description || null,
    },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/qr/${id}`);
  return { success: true, qrCode };
}

export async function toggleQRCodeStatus(id: string, isActive: boolean) {
  await requireAuth();

  const qrCode = await prisma.qRCode.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/qr/${id}`);
  return { success: true, qrCode };
}

export async function deleteQRCode(id: string) {
  await requireAuth();

  await prisma.qRCode.delete({
    where: { id },
  });

  revalidatePath('/admin');
  return { success: true };
}

export async function getQRCodes() {
  await requireAuth();
  return prisma.qRCode.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getQRCode(id: string) {
  await requireAuth();
  return prisma.qRCode.findUnique({
    where: { id },
  });
}

export async function getQRCodeAnalytics(id: string) {
  await requireAuth();
  
  const [totalScans, todayScans, weekScans, monthScans, deviceStats, recentScans] = await Promise.all([
    prisma.qRScan.count({ where: { qrCodeId: id } }),
    
    prisma.qRScan.count({
      where: {
        qrCodeId: id,
        scannedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    
    prisma.qRScan.count({
      where: {
        qrCodeId: id,
        scannedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    
    prisma.qRScan.count({
      where: {
        qrCodeId: id,
        scannedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    
    // Group by device type
    prisma.qRScan.groupBy({
      by: ['deviceType'],
      where: { qrCodeId: id },
      _count: true,
    }),
    
    // Recent scans
    prisma.qRScan.findMany({
      where: { qrCodeId: id },
      orderBy: { scannedAt: 'desc' },
      take: 10,
    })
  ]);

  return {
    totalScans,
    todayScans,
    weekScans,
    monthScans,
    deviceStats,
    recentScans,
  };
}
