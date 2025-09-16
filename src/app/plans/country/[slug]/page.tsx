'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { AuthHeader } from '../../../../components/auth-header';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Loader2, MapPin, Wifi, Clock, Star, ShoppingCart, ArrowLeft } from 'lucide-react';

interface Plan {
  id: string;
  planName: string | null;
  planCategory: string | null;
  locationName: string | null;
  price: number | null;
  gbs: number | null;
  days: number | null;
  countryCodes: string | null;
  slug: string | null;
  planId: string | null;
  isPopular: boolean;
  features: string[];
  maxSpeed: string | null;
  status: string;
  sms?: string | null;
  reloadable?: string | null;
  operators?: string | null;
  category?: {
    id: string;
    name: string;
    color: string | null;
  } | null;
}

interface PlansResponse {
  success: boolean;
  data: {
    plans: Plan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    filters: {
      categories: Array<{ id: string; name: string; color: string | null }>;
      countries: string[];
      dataAmounts: string[];
      durations: number[];
    };
  };
}

function unslugify(slug: string) {
  try {
    const s = decodeURIComponent(slug).replace(/-/g, ' ');
    return s
      .split(' ')
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
  } catch (_) {
    return slug;
  }
}

export default function CountryPlansPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const countryParam = useMemo(() => unslugify(params.slug), [params.slug]);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
  const [countries, setCountries] = useState<string[]>([]);

  const [draftFilters, setDraftFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    dataAmount: '',
    duration: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    dataAmount: '',
    duration: ''
  });

  const formatCurrency = (value: number | null) => {
    if (value == null) return '—';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value) + ' USD';
    } catch {
      return `$${value.toFixed(2)} USD`;
    }
  };

  const safeSmsLabel = (sms?: string | null) => {
    if (!sms) return null;
    const v = String(sms).trim().toLowerCase();
    if (v === 'api') return null;
    return `SMS: ${sms}`;
  };

  const pricePerGb = (price: number | null, gbs: number | null) => {
    if (price == null || !gbs || gbs <= 0) return null;
    const per = price / gbs;
    return per > 0 ? `~ $${per.toFixed(2)} / GB` : null;
  };

  const pricePerDay = (price: number | null, days: number | null) => {
    if (price == null || !days || days <= 0) return null;
    const per = price / days;
    return per > 0 ? `~ $${per.toFixed(2)} / day` : null;
  };

  useEffect(() => {
    // Reset when country changes and try to hydrate from session cache for instant paint
    setPlans([]);
    setPage(1);
    setHasMore(true);
    try {
      const cacheKey = `countryPlans:${countryParam}:page:1`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as Plan[];
        if (Array.isArray(parsed) && parsed.length) {
          setPlans(parsed);
          setLoading(false);
        }
      }
    } catch (_e) {}
  }, [countryParam]);

  useEffect(() => {
    fetchPlans(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryParam, appliedFilters]);

  const fetchPlans = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      const params = new URLSearchParams();
      params.set('limit', '24');
      params.set('country', countryParam);
      params.set('page', String(reset ? 1 : page));
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`/api/plans?${params.toString()}`);
      const data: PlansResponse = await response.json();
      if (data.success) {
        const sortedPlans = data.data.plans.sort((a, b) => {
          const nameA = a.planName || a.locationName || '';
          const nameB = b.planName || b.locationName || '';
          return nameA.localeCompare(nameB);
        });
        setPlans((prev) => (reset ? sortedPlans : [...prev, ...sortedPlans]));
        // Save first page to session cache for instant subsequent loads
        try {
          if ((reset && (data.data.pagination.page === 1)) || (!reset && page === 1)) {
            const cacheKey = `countryPlans:${countryParam}:page:1`;
            sessionStorage.setItem(cacheKey, JSON.stringify(sortedPlans));
          }
        } catch (_e) {}
        setCategories(data.data.filters.categories);
        setCountries(data.data.filters.countries);
        const totalPages = data.data.pagination.pages;
        const currentPage = reset ? 1 : page;
        setHasMore(currentPage < totalPages);
      } else {
        setError('Failed to fetch plans');
      }
    } catch (err) {
      setError('Failed to fetch plans');
      console.error('Error fetching country plans:', err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const applyFilters = () => {
    setAppliedFilters((prev) => ({ ...prev, ...draftFilters }));
  };

  const clearFilters = () => {
    const cleared = { search: '', categoryId: '', minPrice: '', maxPrice: '', dataAmount: '', duration: '' };
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
  };

  const loadMore = () => {
    if (!hasMore || isFetchingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlans(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/plans" className="hover:text-primary flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Plans
              </Link>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{countryParam} eSIM Packages</h1>
            <p className="text-muted-foreground">All available packages for {countryParam}</p>
          </div>

          {/* Filters (same layout as main) */}
          <div className="mb-8">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Search packages..."
                  value={draftFilters.search}
                  onChange={(e) => setDraftFilters({ ...draftFilters, search: e.target.value })}
                  className="w-full"
                />

                <Select value={draftFilters.categoryId} onValueChange={(value) => setDraftFilters({ ...draftFilters, categoryId: value === 'all' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={draftFilters.dataAmount} onValueChange={(value) => setDraftFilters({ ...draftFilters, dataAmount: value === 'all' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Data Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data</SelectItem>
                    <SelectItem value="1GB">1GB</SelectItem>
                    <SelectItem value="5GB">5GB</SelectItem>
                    <SelectItem value="10GB">10GB</SelectItem>
                    <SelectItem value="20GB">20GB</SelectItem>
                    <SelectItem value="50GB">50GB</SelectItem>
                    <SelectItem value="100GB">100GB</SelectItem>
                    <SelectItem value="Unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={draftFilters.duration} onValueChange={(value) => setDraftFilters({ ...draftFilters, duration: value === 'all' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    {[7, 15, 30, 60, 90, 180, 365].map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button variant="outline" className="bg-transparent" onClick={clearFilters}>Clear</Button>
              </div>
            </Card>
          </div>

          {loading && (
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating results...
            </div>
          )}

          {/* Plans Grid (country-specific) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white/90 backdrop-blur ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 border-b bg-gradient-to-r from-muted/40 to-transparent">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{plan.planName || 'eSIM Plan'}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.locationName ? `Stay connected in ${plan.locationName}` : 'Stay connected worldwide'}
                      </CardDescription>
                    </div>
                    {plan.category && (
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: plan.category.color || undefined }}
                      >
                        {plan.category.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{plan.gbs ? `${plan.gbs}GB` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{plan.days ? `${plan.days} days` : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{plan.locationName || countryParam}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features && plan.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {plan.features
                          .filter((f) => typeof f === 'string' && f.trim())
                          .slice(0, 4)
                          .map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature.includes(':') ? feature.split(':')[0] : feature}
                            </Badge>
                          ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {safeSmsLabel(plan.sms) && (
                        <Badge variant="secondary" className="text-xs">{safeSmsLabel(plan.sms)}</Badge>
                      )}
                      {plan.reloadable && (
                        <Badge variant="secondary" className="text-xs">Reloadable: {plan.reloadable}</Badge>
                      )}
                      {plan.operators && (
                        <Badge variant="secondary" className="text-xs">{plan.operators}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                        <span className="text-xs text-muted-foreground">one-time</span>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {pricePerGb(plan.price, plan.gbs) && <div>{pricePerGb(plan.price, plan.gbs)}</div>}
                        {pricePerDay(plan.price, plan.days) && <div>{pricePerDay(plan.price, plan.days)}</div>}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    onClick={() => (window.location.href = `/checkout?planId=${plan.id}`)}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Get This Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Infinite scroll load more */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMore} disabled={isFetchingMore} variant="outline" className="bg-transparent">
                {isFetchingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}

          {plans.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No packages found for {countryParam}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


