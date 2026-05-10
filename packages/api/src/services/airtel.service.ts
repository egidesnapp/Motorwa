import axios from 'axios';
import crypto from 'crypto';

const AIRTEL_BASE_URL = process.env.AIRTEL_BASE_URL || 'https://openapi-sandbox.airtel.africa';
const AIRTEL_CLIENT_ID = process.env.AIRTEL_CLIENT_ID || '';
const AIRTEL_CLIENT_SECRET = process.env.AIRTEL_CLIENT_SECRET || '';

let airtelAccessToken: string | null = null;
let airtelTokenExpiry: Date | null = null;

const getAirtelToken = async (): Promise<string> => {
  if (airtelAccessToken && airtelTokenExpiry && airtelTokenExpiry > new Date()) {
    return airtelAccessToken;
  }

  const response = await axios.post(`${AIRTEL_BASE_URL}/auth/oauth2/token`, {
    client_id: AIRTEL_CLIENT_ID,
    client_secret: AIRTEL_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  airtelAccessToken = response.data.access_token as string;
  airtelTokenExpiry = new Date(Date.now() + 55 * 60 * 1000);

  return airtelAccessToken;
};

export const initiateAirtelPayment = async ({
  amount,
  phone,
  reference,
  description,
}: {
  amount: number;
  phone: string;
  reference: string;
  description: string;
}): Promise<{ reference: string }> => {
  const token = await getAirtelToken();

  await axios.post(
    `${AIRTEL_BASE_URL}/merchant/v1/payments/`,
    {
      reference,
      subscriber: { country: 'RW', currency: 'RWF', msisdn: phone },
      transaction: { amount: amount.toString(), country: 'RW', currency: 'RWF', id: reference },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Country': 'RW',
        'X-Currency': 'RWF',
        'Content-Type': 'application/json',
      },
    }
  );

  return { reference };
};

export const checkAirtelPaymentStatus = async (reference: string): Promise<'PENDING' | 'SUCCESSFUL' | 'FAILED'> => {
  const token = await getAirtelToken();

  const response = await axios.get(
    `${AIRTEL_BASE_URL}/merchant/v1/payments/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Country': 'RW',
        'X-Currency': 'RWF',
      },
    }
  );

  const status = response.data.status;
  if (status === 'SUCCESSFUL') return 'SUCCESSFUL';
  if (status === 'FAILED') return 'FAILED';
  return 'PENDING';
};

export const verifyAirtelWebhook = (payload: string, signature: string): boolean => {
  const webhookSecret = process.env.AIRTEL_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('AIRTEL_WEBHOOK_SECRET is not set');
  const expectedSignature = crypto.createHash('sha256')
    .update(webhookSecret + payload)
    .digest('hex');
  return signature === expectedSignature;
};
