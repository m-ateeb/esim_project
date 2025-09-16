import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare, hash } from "bcryptjs"
import { prisma } from "./prisma"
import { generateReferralCode } from "./utils"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Increase OAuth HTTP timeout to reduce callback timeouts in slow networks
      // Extra props are spread with an any-cast to avoid breaking types
      ...({ httpOptions: { timeout: 10000 } } as any),
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password || !user.isActive) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await prisma.userProfile.upsert({
          where: { userId: user.id },
          update: { 
            lastLoginAt: new Date(),
            loginCount: { increment: 1 }
          },
          create: {
            userId: user.id,
            lastLoginAt: new Date(),
            loginCount: 1
          }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isActive: user.isActive,
          referralCode: user.referralCode,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // Required on platforms like Vercel/Netlify behind proxies
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
  events: {
    async createUser({ user }) {
      try {
        const referralCode = generateReferralCode()
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode, emailVerified: new Date() }
        })
        await prisma.userProfile.create({ data: { userId: user.id } })
      } catch (e) {
        console.error("Error finalizing OAuth user:", e)
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth sign in
      if (account?.provider === "google") {
        try {
          // Check if user exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser) {
            // Check if user is active
            if (!existingUser.isActive) {
              console.error("User account is inactive:", existingUser.email)
              return false
            }

            // If they already signed up via credentials (has password), don't auto-link
            // if (existingUser.password) {
            //   // Let NextAuth show OAuthAccountNotLinked so user uses password
            //   return false
            // }

            // Check if this OAuth account is already linked
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId
                }
              }
            })

            if (!existingAccount) {
              // Link the OAuth account to the existing OAuth user (no password)
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                }
              })

              // Update user info if needed
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image,
                  emailVerified: new Date(),
                }
              })

              console.log("Linked Google account to existing OAuth user:", existingUser.email)
            } else {
              console.log("OAuth account already linked to user:", existingUser.email)
            }
          }
          // If no existing user, allow NextAuth to create a new user via adapter
        } catch (error) {
          console.error("Error linking OAuth account:", error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isActive = user.isActive
        token.referralCode = user.referralCode
        // Ensure core identity fields are present for client UI
        token.name = user.name
        token.email = user.email
        // next-auth uses `picture` for image in JWT
        ;(token as any).picture = user.image
      }

      // Handle role updates from admin panel
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as "USER" | "ADMIN" | "MODERATOR",
          isActive: token.isActive as boolean,
          referralCode: token.referralCode as string | null,
          name: (token.name as string) || session.user?.name || null,
          email: (token.email as string) || session.user?.email || null,
          image: ((token as any).picture as string) || (session.user as any)?.image || null,
        }
      }
      return session
    },
  },
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(hashedPassword, password)
}

// Helper function to create user with referral code
export async function createUserWithReferral(data: {
  name: string
  email: string
  password: string
  referredBy?: string
}) {
  const referralCode = generateReferralCode()
  
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await hashPassword(data.password),
      role: "USER",
      referralCode,
      referredBy: data.referredBy,
    }
  })

  // Create user profile
  await prisma.userProfile.create({
    data: {
      userId: user.id,
    }
  })

  // If referred by someone, update their referral count
  if (data.referredBy) {
    await prisma.user.update({
      where: { referralCode: data.referredBy },
      data: {
        referralCount: { increment: 1 }
      }
    })
  }

  return user
}
