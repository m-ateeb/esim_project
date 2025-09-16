export interface Plan {
  id: string;
  status: string;
  isPopular: boolean;
  features: string[];
  maxSpeed: string | null;
  activationType: string;
  stockQuantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  esimAccessData: any | null;
  esimAccessId: string | null;
  isEsimEnabled: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  
  // CSV exact fields - matching the CSV structure exactly
  type: string | null;                    // Type (e.g., "Single 1️⃣")
  planCategory: string | null;            // Plan Category (e.g., "Full Speed")
  locationName: string | null;            // Location Name (e.g., "Afghanistan")
  planName: string | null;                // Plan Name (e.g., "Afghanistan 1GB 7Days")
  price: number | null;                   // Price
  gbs: number | null;                     // GBs
  days: number | null;                    // Days
  preActivationDays: number | null;       // Pre-activation days
  sms: string | null;                     // SMS
  reloadable: string | null;              // Reloadable (yes/no)
  operators: string | null;               // Operators
  countryCodes: string | null;            // Country Codes
  slug: string | null;                    // Slug
  planId: string | null;                  // PlanId
  proposedPriceUsd: number | null;        // proposed_price_usd
  country: string | null;                 // Country
  ourCost: number | null;                 // our_cost
  appliedMarkupPct: number | null;        // applied_markup_pct
}

// CSV Row type for import operations
export interface CsvRow {
  Type: string;
  'Plan Category': string;
  'Location Name': string;
  'Plan Name': string;
  Price: string;
  GBs: string;
  Days: string;
  'Pre-activation days': string;
  SMS: string;
  Reloadable: string;
  Operators: string;
  'Country Codes': string;
  Slug: string;
  PlanId: string;
  proposed_price_usd?: string;
  Country?: string;
  our_cost?: string;
  applied_markup_pct?: string;
}
