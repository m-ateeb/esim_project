import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/users/profile - Get logged-in user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = CACHE_KEYS.USER_PROFILE(session.user.id);

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!user) {
          return null;
        }

        return {
          success: true,
          data: user,
        };
      },
      CACHE_TTL.MEDIUM
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    );
  }
}
