import axios from 'axios';
import crypto from 'crypto';
import { prisma } from '@motorwa/database';

const MTN_BASE_URL = process.env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com';
const MTN_SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY || '';
const MTN_API_USER = process.env.MTN_API_USER || '';
const MTN_API_KEY = process.env.MTN_API_KEY || '';
const MTN_TARGET_ENV = process.env.MTN_TARGET_ENV || 'sandbox';

let mtnAccessToken: string | null = null;
let mtnTokenExpiry: Date | null = null;

const getMtnToken = async (): Promise<string> => {
  if (mtnAccessToken && mtnTokenExpiry && mtnTokenExpiry > new Date()) {
    return mtnAccessToken;
  }

  const credentials = Buffer.from(`${MTN_API_USER}:${MTN_API_KEY}`).toString('base64');

  const response = await axios.post(`${MTN_BASE_URL}/collection/token/`, {}, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
    },
  });

  mtnAccessToken = response.data.access_token as string;
  mtnTokenExpiry = new Date(Date.now() + 55 * 60 * 1000);

  return mtnAccessToken;
};

export const initiateMtnPayment = async ({
  amount,
  payerPhone,
  paymentId,
  description,
}: {
  amount: number;
  payerPhone: string;
  paymentId: string;
  description: string;
}): Promise<{ reference: string }> => {
  const token = await getMtnToken();

  const referenceId = crypto.randomUUID();

  await axios.post(
    `${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      amount: amount.toString(),
      currency: 'RWF',
      externalId: paymentId,
      payer: { partyIdType: 'MSISDN', partyId: payerPhone },
      payerMessage: description,
      payeeNote: description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': MTN_TARGET_ENV,
        'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  return { reference: referenceId };
};

export const checkMtnPaymentStatus = async (referenceId: string): Promise<'PENDING' | 'SUCCESSFUL' | 'FAILED'> => {
  const token = await getMtnToken();

  const response = await axios.get(
    `${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Target-Environment': MTN_TARGET_ENV,
        'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
      },
    }
  );

  const status = response.data.status;
  if (status === 'SUCCESSFUL') return 'SUCCESSFUL';
  if (status === 'FAILED') return 'FAILED';
  return 'PENDING';
};

export const verifyMtnWebhook = (payload: string, signature: string): boolean => {
  const webhookSecret = process.env.MTN_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('MTN_WEBHOOK_SECRET is not set');
  const expectedSignature = crypto.createHash('sha256')
    .update(webhookSecret + payload)
    .digest('hex');
  return signature === expectedSignature;
};
