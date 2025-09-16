// lib/email.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || process.env.SMTP_FROM || 'noreply@esim-website.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  // Email templates
  getWelcomeEmail(userName: string): EmailTemplate {
    return {
      subject: 'Welcome to eSIM Website!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to eSIM Website!</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for joining us! We're excited to have you on board.</p>
          <p>With our eSIM service, you can:</p>
          <ul>
            <li>Connect to the internet in over 190+ countries</li>
            <li>Get instant activation</li>
            <li>Enjoy competitive pricing</li>
            <li>Manage your plans from anywhere</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The eSIM Website Team</p>
        </div>
      `,
      text: `Welcome to eSIM Website! Hi ${userName}, Thank you for joining us! We're excited to have you on board.`
    };
  }

  getOrderConfirmationEmail(orderNumber: string, planName: string, amount: string): EmailTemplate {
    return {
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Order Confirmation</h1>
          <p>Your order has been confirmed!</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> ${amount}</p>
          </div>
          <p>Your eSIM will be activated shortly. You'll receive another email with your QR code and activation instructions.</p>
          <p>Thank you for choosing eSIM Website!</p>
        </div>
      `,
      text: `Order Confirmation - Your order ${orderNumber} for ${planName} has been confirmed. Amount: ${amount}`
    };
  }

  getEsimActivationEmail(orderNumber: string, qrCodeUrl: string, activationInstructions: string): EmailTemplate {
    return {
      subject: `eSIM Activation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Your eSIM is Ready!</h1>
          <p>Your eSIM has been activated and is ready to use!</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Activation Instructions</h3>
            <p>${activationInstructions}</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${qrCodeUrl}" alt="eSIM QR Code" style="max-width: 200px; border: 1px solid #ddd; border-radius: 8px;" />
            </div>
          </div>
          <p>If you need help, please contact our support team.</p>
          <p>Enjoy your travels!</p>
        </div>
      `,
      text: `eSIM Activation - Your eSIM for order ${orderNumber} is ready! Please scan the QR code to activate.`
    };
  }

  getRefundRequestReceivedEmail(orderNumber: string): EmailTemplate {
    return {
      subject: `Refund Request Received - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Refund Request Received</h1>
          <p>We have received your refund request for order <strong>${orderNumber}</strong>.</p>
          <p>Our team will review it and process the refund within 5-7 working days, if eligible.</p>
          <p>We will notify you by email once the refund has been approved and processed.</p>
          <p>If you didn't request this, please ignore this email or contact support.</p>
        </div>
      `,
      text: `Refund Request Received - We received your request for order ${orderNumber}. We'll process it within 5-7 working days.`
    };
  }

  getRefundApprovedEmail(orderNumber: string, amount: string): EmailTemplate {
    return {
      subject: `Refund Approved - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Refund Approved</h1>
          <p>Your refund for order <strong>${orderNumber}</strong> has been approved.</p>
          <p>Amount: <strong>$${amount}</strong></p>
          <p>The funds should appear on your statement within 5-10 business days.</p>
        </div>
      `,
      text: `Refund Approved - Your refund for order ${orderNumber} of $${amount} was approved.`
    };
  }

  getOrderCancelledEmail(orderNumber: string): EmailTemplate {
    return {
      subject: `Order Cancelled - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Order Cancelled</h1>
          <p>Your order <strong>${orderNumber}</strong> has been cancelled as requested.</p>
          <p>If this was a mistake, you can place a new order anytime.</p>
        </div>
      `,
      text: `Order Cancelled - Your order ${orderNumber} has been cancelled.`
    };
  }

  getDataUsageAlertEmail(userName: string, planName: string, dataUsed: string, dataRemaining: string): EmailTemplate {
    return {
      subject: 'Data Usage Alert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">Data Usage Alert</h1>
          <p>Hi ${userName},</p>
          <p>This is a friendly reminder about your data usage.</p>
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3>Current Usage</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Data Used:</strong> ${dataUsed}</p>
            <p><strong>Data Remaining:</strong> ${dataRemaining}</p>
          </div>
          <p>Consider purchasing additional data if needed.</p>
        </div>
      `,
      text: `Data Usage Alert - Hi ${userName}, you've used ${dataUsed} of your ${planName} plan. Remaining: ${dataRemaining}`
    };
  }

  getExpiryReminderEmail(userName: string, planName: string, expiryDate: string): EmailTemplate {
    return {
      subject: 'Plan Expiry Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Plan Expiry Reminder</h1>
          <p>Hi ${userName},</p>
          <p>Your eSIM plan is expiring soon!</p>
          <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3>Plan Details</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Expires:</strong> ${expiryDate}</p>
          </div>
          <p>Renew your plan to continue enjoying uninterrupted connectivity.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/plans" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Browse Plans</a></p>
        </div>
      `,
      text: `Plan Expiry Reminder - Hi ${userName}, your ${planName} plan expires on ${expiryDate}. Please renew to continue.`
    };
  }

  getPasswordResetEmail(resetToken: string, userName: string): EmailTemplate {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    return {
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Password Reset Request</h1>
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
      text: `Password Reset Request - Hi ${userName}, click this link to reset your password: ${resetUrl}`
    };
  }
}

export const emailService = new EmailService();
export default emailService;
