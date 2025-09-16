// lib/notifications.ts
import { prisma } from './prisma';
import emailService from './email';
import smsService from './sms';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  data?: any;
  sendEmail?: boolean;
  sendSms?: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

class NotificationService {
  // Send notification to user
  async sendNotification(notificationData: NotificationData): Promise<boolean> {
    try {
      // Get user preferences
      const user = await prisma.user.findUnique({
        where: { id: notificationData.userId },
        include: { profile: true }
      });

      if (!user) {
        console.error('User not found for notification:', notificationData.userId);
        return false;
      }

      // Create notification record
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          data: notificationData.data || {}
        }
      });

      let success = true;

      // Send email if requested and user has email
      if (notificationData.sendEmail && user.email) {
        const emailSuccess = await this.sendEmailNotification(user, notification);
        if (!emailSuccess) success = false;
      }

      // Send SMS if requested and user has phone
      if (notificationData.sendSms && user.phone) {
        const smsSuccess = await this.sendSmsNotification(user, notification);
        if (!smsSuccess) success = false;
      }

      return success;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Send email notification
  private async sendEmailNotification(user: any, notification: any): Promise<boolean> {
    try {
      const emailTemplate = this.getEmailTemplate(notification);
      if (!emailTemplate) {
        return false;
      }

      return await emailService.sendEmail({
        to: user.email!,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  // Send SMS notification
  private async sendSmsNotification(user: any, notification: any): Promise<boolean> {
    try {
      const smsMessage = this.getSmsMessage(notification);
      if (!smsMessage) {
        return false;
      }

      return await smsService.sendSms({
        to: user.phone!,
        body: smsMessage
      });
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      return false;
    }
  }

  // Get email template based on notification type
  private getEmailTemplate(notification: any): { subject: string; html: string; text: string } | null {
    switch (notification.type) {
      case 'SUCCESS':
        return {
          subject: notification.title,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">${notification.title}</h2>
              <p>${notification.message}</p>
              <div style="background: #d1fae5; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #065f46;">${notification.message}</p>
              </div>
            </div>
          `,
          text: `${notification.title}: ${notification.message}`
        };
      
      case 'WARNING':
        return {
          subject: notification.title,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d97706;">${notification.title}</h2>
              <p>${notification.message}</p>
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #92400e;">${notification.message}</p>
              </div>
            </div>
          `,
          text: `${notification.title}: ${notification.message}`
        };
      
      case 'ERROR':
        return {
          subject: notification.title,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">${notification.title}</h2>
              <p>${notification.message}</p>
              <div style="background: #fee2e2; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #991b1b;">${notification.message}</p>
              </div>
            </div>
          `,
          text: `${notification.title}: ${notification.message}`
        };
      
      default:
        return {
          subject: notification.title,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">${notification.title}</h2>
              <p>${notification.message}</p>
              <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #1e40af;">${notification.message}</p>
              </div>
            </div>
          `,
          text: `${notification.title}: ${notification.message}`
        };
    }
  }

  // Get SMS message based on notification type
  private getSmsMessage(notification: any): string | null {
    return `${notification.title}: ${notification.message}`;
  }

  // Send order confirmation notification
  async sendOrderConfirmation(userId: string, orderNumber: string, planName: string, amount: string): Promise<boolean> {
    const notificationData: NotificationData = {
      userId,
      title: 'Order Confirmed',
      message: `Your order ${orderNumber} for ${planName} has been confirmed. Amount: ${amount}`,
      type: 'SUCCESS',
      data: { orderNumber, planName, amount },
      sendEmail: true,
      sendSms: true
    };

    return await this.sendNotification(notificationData);
  }

  // Send eSIM activation notification
  async sendEsimActivation(userId: string, orderNumber: string): Promise<boolean> {
    const notificationData: NotificationData = {
      userId,
      title: 'eSIM Ready',
      message: `Your eSIM for order ${orderNumber} is ready! Check your email for QR code and instructions.`,
      type: 'SUCCESS',
      data: { orderNumber },
      sendEmail: true,
      sendSms: true
    };

    return await this.sendNotification(notificationData);
  }

  // Send data usage alert
  async sendDataUsageAlert(userId: string, planName: string, dataUsed: string, dataRemaining: string): Promise<boolean> {
    const notificationData: NotificationData = {
      userId,
      title: 'Data Usage Alert',
      message: `You've used ${dataUsed} of your ${planName}. Remaining: ${dataRemaining}`,
      type: 'WARNING',
      data: { planName, dataUsed, dataRemaining },
      sendEmail: true,
      sendSms: true
    };

    return await this.sendNotification(notificationData);
  }

  // Send expiry reminder
  async sendExpiryReminder(userId: string, planName: string, daysLeft: number): Promise<boolean> {
    const notificationData: NotificationData = {
      userId,
      title: 'Plan Expiry Reminder',
      message: `Your ${planName} expires in ${daysLeft} days. Renew now to stay connected!`,
      type: 'WARNING',
      data: { planName, daysLeft },
      sendEmail: true,
      sendSms: true
    };

    return await this.sendNotification(notificationData);
  }

  // Send welcome notification
  async sendWelcomeNotification(userId: string, userName: string): Promise<boolean> {
    const notificationData: NotificationData = {
      userId,
      title: 'Welcome to eSIM Website!',
      message: `Hi ${userName}, welcome to eSIM Website! Your account is now active.`,
      type: 'SUCCESS',
      data: { userName },
      sendEmail: true,
      sendSms: false // Usually don't send SMS for welcome
    };

    return await this.sendNotification(notificationData);
  }

  // Send password reset notification
  async sendPasswordResetNotification(userId: string): Promise<boolean> {
    const notificationData: NotificationData = {
      userId,
      title: 'Password Reset Request',
      message: 'We received your password reset request. Check your email for the reset link.',
      type: 'INFO',
      data: {},
      sendEmail: true,
      sendSms: true
    };

    return await this.sendNotification(notificationData);
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      });
    } catch (error) {
      console.error('Failed to get user notifications:', error);
      return [];
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: { userId, isRead: false }
      });
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  // Delete old notifications (cleanup)
  async cleanupOldNotifications(daysOld: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      return result.count;
    } catch (error) {
      console.error('Failed to cleanup old notifications:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
