import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"
import { createUserWithReferral } from "../../../../../lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referredBy: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, referredBy } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Validate referral code if provided
    if (referredBy) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referredBy }
      })
      
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        )
      }
    }

    // Create user with referral system
    const user = await createUserWithReferral({
      name,
      email,
      password,
      referredBy,
    })

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          referralCode: user.referralCode,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
