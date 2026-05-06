import { randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@motorwa/database';

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;

export const generateOtp = (): string => {
  return String(randomInt(100000, 999999));
};

export const sendOtp = async (phone: string): Promise<boolean> => {
  const code = generateOtp();
  const hashedCode = await bcrypt.hash(code, 12);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: {
      phone,
      code: hashedCode,
      expiresAt,
    },
  });

  // Send SMS via Africa's Talking
  try {
    const { sendSms } = await import('./sms');
    await sendSms(phone, `Your MotorWa verification code is: ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${phone}: ${code}`);
      return true;
    }
    return false;
  }
};

export const verifyOtp = async (phone: string, code: string): Promise<boolean> => {
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      phone,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) return false;

  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });
    return false;
  }

  const isValid = await bcrypt.compare(code, otpRecord.code);

  if (!isValid) {
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { isUsed: true },
  });

  return true;
};
