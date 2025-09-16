import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/prisma"
import { z } from "zod"
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis'

const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
  isActive: z.boolean().optional(),
})

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).default("USER"),
  phone: z.string().optional(),
  country: z.string().optional(),
})

// GET - List all users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""

    const skip = (page - 1) * limit
    const cacheKey = `admin:users:${JSON.stringify({ page, limit, search, role, status })}`

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        // Build where clause
        const where: any = {}
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ]
        }
        
        if (role) {
          where.role = role
        }
        
        if (status === "active") {
          where.isActive = true
        } else if (status === "inactive") {
          where.isActive = false
        }

        // Get users with profile information
        const users = await prisma.user.findMany({
          where,
          include: {
            profile: true,
            _count: {
              select: {
                orders: true,
                userPlans: true,
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" }
        })

        // Get total count for pagination
        const total = await prisma.user.count({ where })

        return {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      },
      CACHE_TTL.SHORT
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password, role, phone, country } = createUserSchema.parse(body)

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password, // Note: This should be hashed in production
        role,
        phone,
        country,
        referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      },
      include: {
        profile: true
      }
    })

    // Create user profile
    await prisma.userProfile.create({
      data: {
        userId: user.id,
      }
    })

    // Invalidate admin users cache
    await CacheService.invalidateAdminCache()

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update user role or status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role, isActive } = updateUserSchema.parse(body)

    // Prevent admin from changing their own role
    if (userId === session.user.id && role) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(typeof isActive === "boolean" && { isActive }),
      },
      include: {
        profile: true,
        _count: {
          select: {
            orders: true,
            userPlans: true,
          }
        }
      }
    })

    // Invalidate admin users cache
    await CacheService.invalidateAdminCache()

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

