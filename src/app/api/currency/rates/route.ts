import { NextResponse } from "next/server";
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// Minimal set of currencies we support across the app
const SUPPORTED = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY"] as const;

// Static fallback in case upstream is unavailable
const FALLBACK_RATES: Record<string, number> = {
	USD: 1,
	EUR: 0.92,
	GBP: 0.78,
	INR: 83.0,
	AUD: 1.50,
	CAD: 1.35,
	JPY: 145.0,
};

export async function GET() {
	try {
		const rates = await CacheService.getOrSet(
			CACHE_KEYS.CURRENCY_RATES,
			async () => {
				// Prefer a robust free API. Frankfurter is reliable and simple.
				// Docs: https://www.frankfurter.app/
				const symbols = SUPPORTED.join(",");
				const upstream = await fetch(
					`https://api.frankfurter.app/latest?base=USD&symbols=${symbols}`,
					{ next: { revalidate: 60 * 60 } } // ISR: 1 hour
				);

				if (!upstream.ok) {
					return { rates: FALLBACK_RATES, source: "fallback" };
				}

				const json = await upstream.json();
				const rawRates: Record<string, number> = json?.rates ?? {};

				// Ensure USD is always exactly 1
				const rates: Record<string, number> = { USD: 1 };
				for (const cur of SUPPORTED) {
					if (cur === "USD") continue;
					const val = rawRates[cur];
					if (typeof val === "number" && !Number.isNaN(val)) {
						rates[cur] = val;
					}
				}

				return { rates, source: "api" };
			},
			CACHE_TTL.LONG
		);

		return NextResponse.json(rates.rates, {
			headers: {
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ rates: FALLBACK_RATES, source: "error-fallback" },
			{ status: 200, headers: { "Cache-Control": "public, max-age=300" } }
		);
	}
}
