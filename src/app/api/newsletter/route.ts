import { NextRequest, NextResponse } from 'next/server'
import { mailchimpService } from '@/lib/mailchimp'
import { z } from 'zod'

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check if Mailchimp is configured
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID || !process.env.MAILCHIMP_SERVER_PREFIX) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Newsletter service is not configured. Please contact support.' 
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = subscribeSchema.parse(body)
    
    // Subscribe user to Mailchimp
    const result = await mailchimpService.subscribeUser({
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      tags: validatedData.tags || ['website-signup'],
    })

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: result.message 
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid input data',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
