import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@esim.com' },
    update: {},
    create: {
      email: 'admin@esim.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      referralCode: 'ADMIN001',
      phone: '+1234567890',
      country: 'United States',
      timezone: 'America/New_York',
    },
  })

  // Create admin user profile
  await prisma.userProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      preferredLanguage: 'en',
      marketingEmails: false,
      twoFactorEnabled: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample plan categories
  const categories = [
    {
      name: 'Regional Plans',
      description: 'Coverage for specific regions',
      icon: '🌍',
      color: '#3B82F6',
      sortOrder: 1,
    },
    {
      name: 'Global Plans',
      description: 'Worldwide coverage',
      icon: '🌐',
      color: '#10B981',
      sortOrder: 2,
    },
    {
      name: 'Data Plans',
      description: 'High data allowance plans',
      icon: '📊',
      color: '#F59E0B',
      sortOrder: 3,
    },
  ]

  // Clear existing categories and create new ones
  await prisma.planCategory.deleteMany()
  
  for (const category of categories) {
    await prisma.planCategory.create({
      data: category,
    })
  }

  console.log('✅ Plan categories created')

  // Create sample plans
  const plans = [
    {
      name: 'Europe Multi-Country',
      description: 'Stay connected across 30+ European countries',
      dataAmount: '10GB',
      duration: 30,
      countries: ['FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT'],
      price: 29.99,
      originalPrice: 39.99,
      status: 'ACTIVE',
      isPopular: true,
      features: ['4G/5G Coverage', 'Instant Activation', '24/7 Support'],
      maxSpeed: '4G',
      activationType: 'INSTANT',
      stockQuantity: 1000,
    },
    {
      name: 'Asia Pacific',
      description: 'Coverage for major Asian destinations',
      dataAmount: '5GB',
      duration: 15,
      countries: ['JP', 'KR', 'SG', 'TH', 'MY', 'ID', 'PH', 'VN'],
      price: 19.99,
      originalPrice: 24.99,
      status: 'ACTIVE',
      isPopular: false,
      features: ['4G Coverage', 'Instant Activation', 'Local Support'],
      maxSpeed: '4G',
      activationType: 'INSTANT',
      stockQuantity: 500,
    },
    {
      name: 'Global Plan',
      description: 'Worldwide coverage for frequent travelers',
      dataAmount: '20GB',
      duration: 60,
      countries: ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'PE', 'CO'],
      price: 79.99,
      originalPrice: 99.99,
      status: 'ACTIVE',
      isPopular: true,
      features: ['5G Coverage', 'Instant Activation', 'Premium Support'],
      maxSpeed: '5G',
      activationType: 'INSTANT',
      stockQuantity: 200,
    },
  ]

  // Clear existing plans and create new ones
  await prisma.plan.deleteMany()
  
  for (const plan of plans) {
    await prisma.plan.create({
      data: plan,
    })
  }

  console.log('✅ Sample plans created')

  // Create sample promo codes
  const promoCodes = [
    {
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      maxDiscount: 10,
      minOrderAmount: 25,
      maxUses: 1000,
      currentUses: 0,
      isActive: true,
      description: '20% off for new customers',
    },
    {
      code: 'SAVE10',
      type: 'FIXED_AMOUNT',
      value: 10,
      maxDiscount: 10,
      minOrderAmount: 50,
      maxUses: 500,
      currentUses: 0,
      isActive: true,
      description: '$10 off orders over $50',
    },
  ]

  // Clear existing promo codes and create new ones
  await prisma.promoCode.deleteMany()
  
  for (const promoCode of promoCodes) {
    await prisma.promoCode.create({
      data: promoCode,
    })
  }

  console.log('✅ Sample promo codes created')

  // Create sample user
  const userPassword = await hash('user123', 12)
  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
      isActive: true,
      referralCode: 'USER001',
      phone: '+1987654321',
      country: 'Canada',
      timezone: 'America/Toronto',
    },
  })

  // Create user profile
  await prisma.userProfile.upsert({
    where: { userId: sampleUser.id },
    update: {},
    create: {
      userId: sampleUser.id,
      preferredLanguage: 'en',
      marketingEmails: true,
      twoFactorEnabled: false,
    },
  })

  console.log('✅ Sample user created:', sampleUser.email)

  console.log('🎉 Database seeding completed!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@esim.com / admin123')
  console.log('User: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
