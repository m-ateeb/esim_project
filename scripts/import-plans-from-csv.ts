import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { PrismaClient,   PlanStatus } from '@prisma/client'

const prisma = new PrismaClient()

import { CsvRow } from '../src/types/plan';

type ValidationIssue = {
  rowNumber: number
  severity: 'error' | 'warning'
  message: string
}

function toDecimalString(val: string | number | null | undefined): string | null {
  if (val === null || val === undefined) return null
  const num = typeof val === 'number' ? val : Number(String(val).trim())
  return Number.isFinite(num) ? num.toString() : null
}

function toBoolean(val: string | null | undefined): boolean | null {
  if (val === null || val === undefined) return null
  const normalized = String(val).trim().toLowerCase()
  if (['yes', 'true', '1', 'y'].includes(normalized)) return true
  if (['no', 'false', '0', 'n'].includes(normalized)) return false
  return null
}

function validateRow(row: CsvRow, rowNumber: number): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!row['Plan Name']?.trim()) {
    issues.push({ rowNumber, severity: 'error', message: 'Missing Plan Name' })
  }

  const price = Number(String(row.Price || '').trim())
  if (!Number.isFinite(price) || price <= 0) {
    issues.push({ rowNumber, severity: 'error', message: 'Invalid Price' })
  }

  const days = Number(String(row.Days || '').trim())
  if (!Number.isFinite(days) || days <= 0) {
    issues.push({ rowNumber, severity: 'error', message: 'Invalid Days' })
  }

  const gbs = Number(String(row.GBs || '').trim())
  if (!Number.isFinite(gbs) || gbs <= 0) {
    issues.push({ rowNumber, severity: 'warning', message: 'Invalid GBs value' })
  }

  if (!row['Country Codes']?.trim()) {
    issues.push({ rowNumber, severity: 'error', message: 'Missing Country Codes' })
  }

  return issues
}

async function upsertPlan(row: CsvRow) {
  const price = Number(String(row.Price).trim())
  const gbs = Number(String(row.GBs).trim())
  const days = Number(String(row.Days).trim())
  const preActivationDays = Number(String(row['Pre-activation days'] || '').trim()) || null
  const proposedPriceUsd = row.proposed_price_usd ? Number(row.proposed_price_usd) : null
  const ourCost = row.our_cost ? Number(row.our_cost) : null
  const appliedMarkupPct = row.applied_markup_pct ? Number(row.applied_markup_pct) : null

  // Ensure category exists/linked
  let categoryId: string | undefined = undefined
  const categoryName = (row['Plan Category'] || '').trim()
  if (categoryName) {
    const existingCat = await prisma.planCategory.findFirst({ where: { name: categoryName } })
    if (existingCat) {
      categoryId = existingCat.id
    } else {
      const created = await prisma.planCategory.create({ data: { name: categoryName, isActive: true } })
      categoryId = created.id
    }
  }

  // Try to locate existing plan by unique keys (planId or slug)
  const slug = (row.Slug || '').trim() || null
  const planId = (row.PlanId || '').trim() || null
  let existing: any = null
  
  if (planId) {
    existing = await prisma.plan.findUnique({ where: { planId } as any, select: { id: true } })
  }
  if (!existing && slug) {
    existing = await prisma.plan.findUnique({ where: { slug } as any, select: { id: true } })
  }

  const planData = {
    status: PlanStatus.ACTIVE,
    features: [
      `SMS: ${row.SMS || 'N/A'}`,
      `Reloadable: ${row.Reloadable || 'N/A'}`,
      `Operators: ${row.Operators || 'N/A'}`
    ],
    maxSpeed: '5G',
    activationType: 'INSTANT',
    isEsimEnabled: true,
    // CSV exact fields - matching the new schema
    // Store in both legacy `type` and explicit `csvType` for compatibility
    type: row.Type || null,
    csvType: row.Type || null,
    planCategory: row['Plan Category'] || null,
    locationName: row['Location Name'] || null,
    countryName: row['Location Name'] || null,
    planName: row['Plan Name'] || null,
    price: price,
    gbs: gbs,
    days: days,
    preActivationDays: preActivationDays,
    sms: row.SMS || null,
    reloadable: toBoolean(row.Reloadable),
    operators: row.Operators || null,
    countryCodes: row['Country Codes'] || null,
    slug: slug,
    planId: planId,
    proposedPriceUsd: proposedPriceUsd,
    country: row.Country || null,
    ourCost: ourCost,
    appliedMarkupPct: appliedMarkupPct,
  }

  if (existing) {
    return prisma.plan.update({ 
      where: { id: existing.id }, 
      data: {
        ...planData,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      } as any,
    })
  }
  
  return prisma.plan.create({
    data: {
      ...planData,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      isPopular: false,
      stockQuantity: 1000,
    } as any,
  })
}

async function main() {
  const args = process.argv.slice(2)
  const fileArgIdx = args.findIndex((a) => !a.startsWith('-'))
  let filePath = fileArgIdx >= 0 ? args[fileArgIdx] : ''
  const commit = args.includes('--commit')
  const verbose = args.includes('--verbose')

  // Resolve CSV path with robust fallbacks
  let absPath = ''
  const candidates: string[] = []
  if (filePath) candidates.push(filePath)
  candidates.push('single_full_speed_plans_pricing_ready (1).csv')
  candidates.push('single_full_speed_plans_pricing_ready.csv')
  
  for (const candidate of candidates) {
    const direct = candidate
    const cwdPath = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate)
    if (existsSync(direct)) { absPath = direct; break }
    if (existsSync(cwdPath)) { absPath = cwdPath; break }
  }

  if (!absPath) {
    console.error('CSV file not found. Tried:', candidates.join(', '))
    process.exit(1)
  }

  console.log(`Reading CSV from: ${absPath}`)

  const csvContent = readFileSync(absPath, 'utf-8')
  const records: CsvRow[] = []

  await new Promise<void>((resolve, reject) => {
    parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }, (err, output) => {
      if (err) reject(err)
      else {
        records.push(...output)
        resolve()
      }
    })
  })

  console.log(`Parsed ${records.length} rows`)

  // Validation phase
  const allIssues: ValidationIssue[] = []
  for (let i = 0; i < records.length; i++) {
    const issues = validateRow(records[i], i + 2) // +2 for header and 0-based index
    allIssues.push(...issues)
  }

  const errors = allIssues.filter(i => i.severity === 'error')
  const warnings = allIssues.filter(i => i.severity === 'warning')

  console.log(`Validation complete: ${records.length} rows, ${errors.length} errors, ${warnings.length} warnings`)

  if (errors.length > 0) {
    console.error('Errors found:')
    errors.forEach(issue => {
      console.error(`  Row ${issue.rowNumber}: ${issue.message}`)
    })
    if (!commit) {
      console.log('Use --commit to import despite errors')
      process.exit(1)
    }
  }

  if (warnings.length > 0 && verbose) {
    console.log('Warnings:')
    warnings.forEach(issue => {
      console.log(`  Row ${issue.rowNumber}: ${issue.message}`)
    })
  }

  if (!commit) {
    console.log('Dry run complete. No database changes made. Use --commit to import.')
    return
  }

  // Import phase
  console.log('Starting import...')
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < records.length; i++) {
    try {
      const result = await upsertPlan(records[i])
      successCount++
      if (verbose) {
        console.log(`✓ ${records[i]['Plan Name']} (${records[i].PlanId})`)
      }
    } catch (error) {
      errorCount++
      console.error(`Failed: ${records[i]['Plan Name']} (${records[i].PlanId}) -> ${error}`)
    }
  }

  console.log(`Import complete: ${successCount} successful, ${errorCount} failed`)
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })