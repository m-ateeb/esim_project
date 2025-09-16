// import mailchimp from '@mailchimp/mailchimp_marketing'

// // Configure Mailchimp
// mailchimp.setConfig({
//   apiKey: process.env.MAILCHIMP_API_KEY,
//   server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., 'us1'
// })

// export interface NewsletterSubscriber {
//   email: string
//   firstName?: string
//   lastName?: string
//   tags?: string[]
// }

// export interface MailchimpResponse {
//   success: boolean
//   message: string
//   data?: any
// }

// export class MailchimpService {
//   private listId: string

//   constructor() {
//     this.listId = process.env.MAILCHIMP_LIST_ID!
    
//     // Validate required environment variables
//     if (!process.env.MAILCHIMP_API_KEY) {
//       throw new Error('MAILCHIMP_API_KEY is not configured')
//     }
//     if (!process.env.MAILCHIMP_SERVER_PREFIX) {
//       throw new Error('MAILCHIMP_SERVER_PREFIX is not configured')
//     }
//     if (!this.listId) {
//       throw new Error('MAILCHIMP_LIST_ID is not configured')
//     }
//   }

//   async subscribeUser(subscriber: NewsletterSubscriber): Promise<MailchimpResponse> {
//     try {
//       const response = await mailchimp.lists.addListMember(this.listId, {
//         email_address: subscriber.email,
//         status: 'subscribed',
//         merge_fields: {
//           FNAME: subscriber.firstName || '',
//           LNAME: subscriber.lastName || '',
//         },
//         tags: subscriber.tags || [],
//       })

//       return {
//         success: true,
//         message: 'Successfully subscribed to newsletter!',
//         data: response,
//       }
//     } catch (error: any) {
//       // Handle specific Mailchimp errors
//       if (error.response?.body?.title === 'Member Exists') {
//         return {
//           success: false,
//           message: 'This email is already subscribed to our newsletter.',
//         }
//       }

//       console.error('Mailchimp subscription error:', error)
//       return {
//         success: false,
//         message: 'Failed to subscribe. Please try again later.',
//       }
//     }
//   }

//   async unsubscribeUser(email: string): Promise<MailchimpResponse> {
//     try {
//       const subscriberHash = this.getSubscriberHash(email)
      
//       await mailchimp.lists.updateListMember(this.listId, subscriberHash, {
//         status: 'unsubscribed',
//       })

//       return {
//         success: true,
//         message: 'Successfully unsubscribed from newsletter.',
//       }
//     } catch (error: any) {
//       console.error('Mailchimp unsubscription error:', error)
//       return {
//         success: false,
//         message: 'Failed to unsubscribe. Please try again later.',
//       }
//     }
//   }

//   async getSubscriberStatus(email: string): Promise<MailchimpResponse> {
//     try {
//       const subscriberHash = this.getSubscriberHash(email)
      
//       const response = await mailchimp.lists.getListMember(this.listId, subscriberHash)
      
//       // Check if response is successful and has the expected properties
//       if ('status' in response && 'timestamp_signup' in response) {
//         return {
//           success: true,
//           message: 'Subscriber found',
//           data: {
//             status: response.status,
//             subscribedAt: response.timestamp_signup,
//           },
//         }
//       } else {
//         return {
//           success: false,
//           message: 'Invalid response format from Mailchimp',
//         }
//       }
//     } catch (error: any) {
//       if (error.response?.status === 404) {
//         return {
//           success: false,
//           message: 'Subscriber not found',
//         }
//       }
      
//       console.error('Mailchimp get subscriber error:', error)
//       return {
//         success: false,
//         message: 'Failed to check subscriber status.',
//       }
//     }
//   }

//   private getSubscriberHash(email: string): string {
//     // Mailchimp requires MD5 hash of lowercase email
//     const crypto = require('crypto')
//     return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
//   }
// }

// // Export singleton instance
// export const mailchimpService = new MailchimpService()








import mailchimp from '@mailchimp/mailchimp_marketing'

// Configure Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., 'us1'
})

export interface NewsletterSubscriber {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
}

export interface MailchimpResponse {
  success: boolean
  message: string
  data?: any
}

export class MailchimpService {
  private listId: string

  constructor() {
    this.listId = process.env.MAILCHIMP_LIST_ID!
    
    // Validate required environment variables
    if (!process.env.MAILCHIMP_API_KEY) {
      throw new Error('MAILCHIMP_API_KEY is not configured')
    }
    if (!process.env.MAILCHIMP_SERVER_PREFIX) {
      throw new Error('MAILCHIMP_SERVER_PREFIX is not configured')
    }
    if (!this.listId) {
      throw new Error('MAILCHIMP_LIST_ID is not configured')
    }
  }

  async subscribeUser(subscriber: NewsletterSubscriber): Promise<MailchimpResponse> {
    try {
      const response = await mailchimp.lists.addListMember(this.listId, {
        email_address: subscriber.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: subscriber.firstName || '',
          LNAME: subscriber.lastName || '',
        },
        tags: subscriber.tags || [],
      })

      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: response,
      }
    } catch (error: any) {
      // ✅ Handle specific Mailchimp errors
      if (error.response?.body?.title === 'Member Exists') {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.',
        }
      }

      if (error.response?.body?.detail) {
        return {
          success: false,
          message: error.response.body.detail, // show actual Mailchimp error from API
        }
      }

      console.error('Mailchimp subscription error:', error)
      return {
        success: false,
        message: error.message || 'Failed to subscribe. Please try again later.',
      }
    }
  }

  async unsubscribeUser(email: string): Promise<MailchimpResponse> {
    try {
      const subscriberHash = this.getSubscriberHash(email)
      
      await mailchimp.lists.updateListMember(this.listId, subscriberHash, {
        status: 'unsubscribed',
      })

      return {
        success: true,
        message: 'Successfully unsubscribed from newsletter.',
      }
    } catch (error: any) {
      console.error('Mailchimp unsubscription error:', error)
      return {
        success: false,
        message: error.response?.body?.detail || 'Failed to unsubscribe. Please try again later.',
      }
    }
  }

  async getSubscriberStatus(email: string): Promise<MailchimpResponse> {
    try {
      const subscriberHash = this.getSubscriberHash(email)
      
      const response = await mailchimp.lists.getListMember(this.listId, subscriberHash)
      
      // Check if response is successful and has the expected properties
      if ('status' in response && 'timestamp_signup' in response) {
        return {
          success: true,
          message: 'Subscriber found',
          data: {
            status: response.status,
            subscribedAt: response.timestamp_signup,
          },
        }
      } else {
        return {
          success: false,
          message: 'Invalid response format from Mailchimp',
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Subscriber not found',
        }
      }
      
      console.error('Mailchimp get subscriber error:', error)
      return {
        success: false,
        message: error.response?.body?.detail || 'Failed to check subscriber status.',
      }
    }
  }

  private getSubscriberHash(email: string): string {
    // Mailchimp requires MD5 hash of lowercase email
    const crypto = require('crypto')
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
  }
}

// Export singleton instance
export const mailchimpService = new MailchimpService()
