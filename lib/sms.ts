// lib/sms.ts
import twilio from 'twilio';

interface SmsOptions {
  to: string;
  body: string;
  from?: string;
}

class SmsService {
  private client: twilio.Twilio;
  private defaultFrom: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.warn('Twilio credentials not found. SMS service will be disabled.');
      this.client = null as any;
      this.defaultFrom = '';
      return;
    }

    this.client = twilio(accountSid, authToken);
    this.defaultFrom = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendSms(options: SmsOptions): Promise<boolean> {
    try {
      if (!this.client) {
        console.warn('SMS service is disabled due to missing Twilio credentials');
        return false;
      }

      const message = await this.client.messages.create({
        body: options.body,
        from: options.from || this.defaultFrom,
        to: options.to
      });

      console.log('SMS sent successfully:', message.sid);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  // SMS templates
  getOrderConfirmationSms(orderNumber: string, planName: string): string {
    return `Your eSIM order ${orderNumber} for ${planName} has been confirmed! You'll receive activation details via email.`;
  }

  getEsimActivationSms(orderNumber: string): string {
    return `Your eSIM for order ${orderNumber} is ready! Check your email for QR code and activation instructions.`;
  }

  getDataUsageAlertSms(planName: string, dataUsed: string, dataRemaining: string): string {
    return `Data Alert: You've used ${dataUsed} of your ${planName}. Remaining: ${dataRemaining}. Consider topping up.`;
  }

  getExpiryReminderSms(planName: string, daysLeft: number): string {
    return `Reminder: Your ${planName} expires in ${daysLeft} days. Renew now to stay connected!`;
  }

  getPasswordResetSms(): string {
    return 'Your password reset request has been received. Check your email for the reset link.';
  }

  getWelcomeSms(userName: string): string {
    return `Welcome ${userName}! Your eSIM account is now active. Enjoy global connectivity!`;
  }

  // Bulk SMS for marketing (use with caution)
  async sendBulkSms(phoneNumbers: string[], message: string): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await this.sendSms({ to: phoneNumber, body: message });
        if (result) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error(`Failed to send SMS to ${phoneNumber}:`, error);
      }
    }

    return { success, failed };
  }

  // Verify phone number
  async verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }

      // This is a basic verification - in production, you might want to use Twilio's Verify API
      const response = await this.client.lookups.v1.phoneNumbers(phoneNumber).fetch();
      return response.valid || false;
    } catch (error) {
      console.error('Phone number verification failed:', error);
      return false;
    }
  }

  // Get phone number info
  async getPhoneNumberInfo(phoneNumber: string): Promise<{
    countryCode: string;
    region: string;
    carrier: string;
  } | null> {
    try {
      if (!this.client) {
        return null;
      }

      const response = await this.client.lookups.v1.phoneNumbers(phoneNumber).fetch({
        type: ['carrier', 'caller-name']
      });

      return {
        countryCode: response.countryCode || '',
        region: response.region || '',
        carrier: response.carrier?.name || ''
      };
    } catch (error) {
      console.error('Failed to get phone number info:', error);
      return null;
    }
  }
}

export const smsService = new SmsService();
export default smsService;
