import africastalking from 'africastalking';

const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_API_KEY = process.env.AT_API_KEY || '';
const AT_SENDER_ID = process.env.AT_SENDER_ID || 'MotorWa';

const at = africastalking({
  apiKey: AT_API_KEY,
  username: AT_USERNAME,
});

const sms = at.SMS;

export const sendSms = async (phone: string, message: string): Promise<any> => {
  return sms.send({
    to: phone,
    message,
    from: AT_SENDER_ID,
  });
};
