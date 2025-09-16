import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique referral code
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Check if user has admin privileges
export function isAdmin(role: string): boolean {
  return role === 'ADMIN' || role === 'MODERATOR'
}

// Check if user has moderator privileges
export function isModerator(role: string): boolean {
  return role === 'MODERATOR'
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Format data usage
export function formatDataUsage(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `ESM-${timestamp.slice(-6)}-${random}`
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calculate discount amount
export function calculateDiscount(originalPrice: number, discountType: 'PERCENTAGE' | 'FIXED_AMOUNT', discountValue: number): number {
  if (discountType === 'PERCENTAGE') {
    return (originalPrice * discountValue) / 100
  }
  return Math.min(discountValue, originalPrice)
}

// Check if promo code is valid
export function isPromoCodeValid(
  promoCode: any,
  orderAmount: number,
  userId?: string
): { isValid: boolean; message: string } {
  if (!promoCode.isActive) {
    return { isValid: false, message: 'Promo code is inactive' }
  }

  if (promoCode.validUntil && new Date() > new Date(promoCode.validUntil)) {
    return { isValid: false, message: 'Promo code has expired' }
  }

  if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
    return { isValid: false, message: 'Promo code usage limit reached' }
  }

  if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
    return { isValid: false, message: `Minimum order amount of ${formatCurrency(promoCode.minOrderAmount)} required` }
  }

  if (promoCode.applicableUsers.length > 0 && userId && !promoCode.applicableUsers.includes(userId)) {
    return { isValid: false, message: 'Promo code not applicable to this user' }
  }

  return { isValid: true, message: 'Promo code is valid' }
}
