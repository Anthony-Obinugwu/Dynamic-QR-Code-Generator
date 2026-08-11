import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. Lookup the QR code
  const qrCode = await prisma.qRCode.findUnique({
    where: { slug },
  });

  // 2. Verify existence and active status
  if (!qrCode) {
    return new NextResponse('QR code not found.', { status: 404 });
  }

  if (!qrCode.isActive) {
    return new NextResponse('This QR code is currently inactive.', { status: 403 });
  }

  // 3. Record the scan
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  // Get IP (this depends on your hosting provider, e.g., Vercel uses x-forwarded-for)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

  const deviceType = getDeviceType(userAgent);
  const ipHash = ip !== 'unknown' ? hashIp(ip) : null;

  // We can execute this asynchronously without awaiting if we want faster redirects,
  // but in Serverless functions (like Vercel), background tasks might be killed.
  // We'll await it to be safe, it's fast enough.
  await prisma.$transaction([
    prisma.qRScan.create({
      data: {
        qrCodeId: qrCode.id,
        userAgent,
        deviceType,
        referrer,
        ipHash,
      },
    }),
    prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { scanCount: { increment: 1 } },
    }),
  ]);

  // 4. Redirect
  return NextResponse.redirect(qrCode.destinationUrl);
}
