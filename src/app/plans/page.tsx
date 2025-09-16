// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
// import { Badge } from "../../components/ui/badge"
// import { Input } from "../../components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import { Slider } from "../../components/ui/slider"
// import { Globe, Search, Filter, MapPin, Wifi, Clock, Star, ShoppingCart, Loader2 } from "lucide-react"
// import Link from "next/link"
// import { AuthHeader } from "../../components/auth-header"

// interface Plan {
//   id: string;
//   planName: string | null;
//   planCategory: string | null;
//   locationName: string | null;
//   price: number;
//   gbs: number | null;
//   days: number | null;
//   countryCodes: string | null;
//   slug: string | null;
//   planId: string | null;
//   isPopular: boolean;
//   features: string[];
//   maxSpeed: string | null;
//   status: string;
//   category?: {
//     id: string;
//     name: string;
//     color: string | null;
//   } | null;
// }

// interface PlansResponse {
//   success: boolean;
//   data: {
//     plans: Plan[];
//     pagination: {
//       page: number;
//       limit: number;
//       total: number;
//       pages: number;
//     };
//     filters: {
//       categories: Array<{ id: string; name: string; color: string | null }>;
//       countries: string[];
//       dataAmounts: string[];
//       durations: number[];
//     };
//   };
// }

// export default function PlansPage() {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   // Draft filters reflect UI controls; appliedFilters are sent to API
//   const [draftFilters, setDraftFilters] = useState({
//     search: '',
//     categoryId: '',
//     country: '',
//     minPrice: '',
//     maxPrice: '',
//     dataAmount: '',
//     duration: ''
//   });
//   const [appliedFilters, setAppliedFilters] = useState({
//     search: '',
//     categoryId: '',
//     country: '',
//     minPrice: '',
//     maxPrice: '',
//     dataAmount: '',
//     duration: ''
//   });
//   const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
//   const [countries, setCountries] = useState<string[]>([]);
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   useEffect(() => {
//     fetchPlans();
//   }, [appliedFilters]);

//   const fetchPlans = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
     
//       Object.entries(appliedFilters).forEach(([key, value]) => {
//         if (value) params.append(key, value);
//       });

//       const response = await fetch(`/api/plans?${params.toString()}`);
//       const data: PlansResponse = await response.json();

//       if (data.success) {
//         // Sort plans alphabetically by planName
//         const sortedPlans = data.data.plans.sort((a, b) => {
//           const nameA = a.planName || a.locationName || '';
//           const nameB = b.planName || b.locationName || '';
//           return nameA.localeCompare(nameB);
//         });
//         setPlans(sortedPlans);
//         setCategories(data.data.filters.categories);
//         setCountries(data.data.filters.countries);
//       } else {
//         setError('Failed to fetch plans');
//       }
//     } catch (err) {
//       setError('Failed to fetch plans');
//       console.error('Error fetching plans:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (plan: Plan) => {
//     // For now, redirect to checkout with plan ID
//     // You can implement a cart system later
//     window.location.href = `/checkout?planId=${plan.id}`;
//   };

//   const applyFilters = () => {
//     setAppliedFilters(prev => ({ ...prev, ...draftFilters }));
//   };

//   const clearFilters = () => {
//     const cleared = { search: '', categoryId: '', country: '', minPrice: '', maxPrice: '', dataAmount: '', duration: '' };
//     setDraftFilters(cleared);
//     setAppliedFilters(cleared);
//     setSuggestions([]);
//   };

//   const onSearchChange = (value: string) => {
//     setDraftFilters({ ...draftFilters, search: value });
//     if (!value) {
//       setSuggestions([]);
//       return;
//     }
//     const lower = value.toLowerCase();
//     const countryMatches = countries.filter(c => c.toLowerCase().includes(lower)).slice(0, 6);
//     const categoryMatches = categories
//       .map(c => c.name)
//       .filter(name => name.toLowerCase().includes(lower))
//       .slice(0, 4);
//     setSuggestions([...countryMatches, ...categoryMatches]);
//   };

//   const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       applyFilters();
//     }
//   };

//   const getCountryFlag = (country: string) => {
//     // Simple country to flag mapping
//     const flagMap: Record<string, string> = {
//       'United States': '🇺🇸',
//       'Canada': '🇨🇦',
//       'United Kingdom': '🇬🇧',
//       'France': '🇫🇷',
//       'Germany': '🇩🇪',
//       'Italy': '🇮🇹',
//       'Spain': '🇪🇸',
//       'Japan': '🇯🇵',
//       'South Korea': '🇰🇷',
//       'Australia': '🇦🇺',
//       'China': '🇨🇳',
//       'India': '🇮🇳',
//       'Brazil': '🇧🇷',
//       'Mexico': '🇲🇽',
//       'Argentina': '🇦🇷',
//       'South Africa': '🇿🇦',
//       'Egypt': '🇪🇬',
//       'UAE': '🇦🇪',
//       'Saudi Arabia': '🇸🇦',
//       'Turkey': '🇹🇷'
//     };
//     return flagMap[country] || '🌍';
//   };

//   // Keep layout on screen. Show inline loader only above the grid

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <Button onClick={fetchPlans}>Try Again</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <AuthHeader />

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="max-w-7xl mx-auto">
//           {/* Page Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-balance mb-4">
//               Choose Your Perfect eSIM Plan
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//               Stay connected worldwide with our flexible data plans. Choose from regional packages or go global with unlimited coverage.
//             </p>
//           </div>

//           {/* Filters */}
//           <div className="mb-8">
//             <Card className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="relative">
//                   <Input
//                     placeholder="Search plans..."
//                     value={draftFilters.search}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                     onKeyDown={onSearchKeyDown}
//                     className="w-full"
//                   />
//                   {suggestions.length > 0 && (
//                     <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow">
//                       {suggestions.map((s, i) => (
//                         <button
//                           key={`${s}-${i}`}
//                           className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
//                           onClick={() => {
//                             setDraftFilters({ ...draftFilters, search: s });
//                             setSuggestions([]);
//                           }}
//                         >
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
                
//                 <Select value={draftFilters.categoryId} onValueChange={(value) => setDraftFilters({ ...draftFilters, categoryId: value === 'all' ? '' : value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Categories" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Categories</SelectItem>
//                     {categories.map((category) => (
//                       <SelectItem key={category.id} value={category.id}>
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={draftFilters.country} onValueChange={(value) => setDraftFilters({ ...draftFilters, country: value === 'all' ? '' : value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Countries" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Countries</SelectItem>
//                     {countries.map((country) => (
//                       <SelectItem key={country} value={country}>
//                         {country}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={draftFilters.dataAmount} onValueChange={(value) => setDraftFilters({ ...draftFilters, dataAmount: value === 'all' ? '' : value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Data Amount" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Data</SelectItem>
//                     <SelectItem value="1GB">1GB</SelectItem>
//                     <SelectItem value="5GB">5GB</SelectItem>
//                     <SelectItem value="10GB">10GB</SelectItem>
//                     <SelectItem value="20GB">20GB</SelectItem>
//                     <SelectItem value="50GB">50GB</SelectItem>
//                     <SelectItem value="100GB">100GB</SelectItem>
//                     <SelectItem value="Unlimited">Unlimited</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="mt-4 flex items-center gap-3">
//                 <Button onClick={applyFilters}>
//                   <Search className="h-4 w-4 mr-2" />
//                   Apply Filters
//                 </Button>
//                 <Button variant="outline" className="bg-transparent" onClick={clearFilters}>Clear</Button>
//               </div>
//             </Card>
//           </div>

//           {loading && (
//             <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Updating results...
//             </div>
//           )}

//           {/* Plans Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {plans.map((plan) => (
//               <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
//                 {plan.isPopular && (
//                   <div className="absolute top-4 right-4">
//                     <Badge className="bg-primary text-primary-foreground">
//                       <Star className="h-3 w-3 mr-1" />
//                       Popular
//                     </Badge>
//                   </div>
//                 )}
                
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <CardTitle className="text-lg">{plan.planName || 'eSIM Plan'}</CardTitle>
//                       <CardDescription className="mt-2">
//                         {plan.locationName ? `Stay connected in ${plan.locationName}` : 'Stay connected worldwide'}
//                       </CardDescription>
//                     </div>
//                     {plan.category && (
//                       <Badge
//                         variant="secondary"
//                         style={{ backgroundColor: plan.category.color || undefined }}
//                       >
//                         {plan.category.name}
//                       </Badge>
//                     )}
//                   </div>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                   {/* Data & Duration */}
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2">
//                       <Wifi className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">{plan.gbs ? `${plan.gbs}GB` : 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Clock className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">{plan.days ? `${plan.days} days` : 'N/A'}</span>
//                     </div>
//                   </div>

//                   {/* Countries */}
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                       <MapPin className="h-4 w-4" />
//                       <span>{plan.locationName || 'Global'}</span>
//                     </div>
//                     {plan.countryCodes && (
//                       <div className="flex flex-wrap gap-1">
//                         <span className="text-xs">
//                           {getCountryFlag(plan.locationName || '')} {plan.locationName}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Features */}
//                   {plan.features.length > 0 && (
//                     <div className="space-y-2">
//                       <p className="text-sm font-medium">Features:</p>
//                       <div className="flex flex-wrap gap-1">
//                         {plan.features.slice(0, 3).map((feature, index) => (
//                           <Badge key={index} variant="outline" className="text-xs">
//                             {feature}
//                           </Badge>
//                         ))}
//                         {plan.features.length > 3 && (
//                           <Badge variant="outline" className="text-xs">
//                             +{plan.features.length - 3} more
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Price */}
//                   <div className="pt-4 border-t">
//                     <div className="flex items-baseline space-x-2">
//                       <span className="text-3xl font-bold">${plan.price}</span>
//                     </div>
//                   </div>
//                 </CardContent>

//                 <CardFooter className="pt-0">
//                   <Button
//                     onClick={() => addToCart(plan)}
//                     className="w-full"
//                     size="lg"
//                   >
//                     <ShoppingCart className="h-4 w-4 mr-2" />
//                     Get This Plan
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>

//           {plans.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-medium mb-2">No plans found</h3>
//               <p className="text-muted-foreground">
//                 Try adjusting your filters or search terms.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
// import { Badge } from "../../components/ui/badge"
// import { Input } from "../../components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import { Slider } from "../../components/ui/slider"
// import { Globe, Search, Filter, MapPin, Wifi, Clock, Star, ShoppingCart, Loader2 } from "lucide-react"
// import Link from "next/link"
// import { AuthHeader } from "../../components/auth-header"
// import PriceDisplay from '../../components/PriceDisplay'; // ⬅️ Import PriceDisplay

// interface Plan {
//   id: string;
//   planName: string | null;
//   planCategory: string | null;
//   locationName: string | null;
//   price: number;
//   gbs: number | null;
//   days: number | null;
//   countryCodes: string | null;
//   slug: string | null;
//   planId: string | null;
//   isPopular: boolean;
//   features: string[];
//   maxSpeed: string | null;
//   status: string;
//   category?: {
//     id: string;
//     name: string;
//     color: string | null;
//   } | null;
// }

// interface PlansResponse {
//   success: boolean;
//   data: {
//     plans: Plan[];
//     pagination: {
//       page: number;
//       limit: number;
//       total: number;
//       pages: number;
//     };
//     filters: {
//       categories: Array<{ id: string; name: string; color: string | null }>;
//       countries: string[];
//       dataAmounts: string[];
//       durations: number[];
//     };
//   };
// }

// export default function PlansPage() {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [draftFilters, setDraftFilters] = useState({
//     search: '',
//     categoryId: '',
//     country: '',
//     minPrice: '',
//     maxPrice: '',
//     dataAmount: '',
//     duration: ''
//   });
//   const [appliedFilters, setAppliedFilters] = useState(draftFilters);
//   const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
//   const [countries, setCountries] = useState<string[]>([]);
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   useEffect(() => {
//     fetchPlans();
//   }, [appliedFilters]);

//   const fetchPlans = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       Object.entries(appliedFilters).forEach(([key, value]) => {
//         if (value) params.append(key, value);
//       });

//       const response = await fetch(`/api/plans?${params.toString()}`);
//       const data: PlansResponse = await response.json();

//       if (data.success) {
//         const sortedPlans = data.data.plans.sort((a, b) => {
//           const nameA = a.planName || a.locationName || '';
//           const nameB = b.planName || b.locationName || '';
//           return nameA.localeCompare(nameB);
//         });
//         setPlans(sortedPlans);
//         setCategories(data.data.filters.categories);
//         setCountries(data.data.filters.countries);
//       } else {
//         setError('Failed to fetch plans');
//       }
//     } catch (err) {
//       setError('Failed to fetch plans');
//       console.error('Error fetching plans:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (plan: Plan) => {
//     window.location.href = `/checkout?planId=${plan.id}`;
//   };

//   const applyFilters = () => {
//     setAppliedFilters({ ...draftFilters });
//   };

//   const clearFilters = () => {
//     const cleared = { search: '', categoryId: '', country: '', minPrice: '', maxPrice: '', dataAmount: '', duration: '' };
//     setDraftFilters(cleared);
//     setAppliedFilters(cleared);
//     setSuggestions([]);
//   };

//   const onSearchChange = (value: string) => {
//     setDraftFilters({ ...draftFilters, search: value });
//     if (!value) {
//       setSuggestions([]);
//       return;
//     }
//     const lower = value.toLowerCase();
//     const countryMatches = countries.filter(c => c.toLowerCase().includes(lower)).slice(0, 6);
//     const categoryMatches = categories.map(c => c.name).filter(name => name.toLowerCase().includes(lower)).slice(0, 4);
//     setSuggestions([...countryMatches, ...categoryMatches]);
//   };

//   const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') applyFilters();
//   };

//   const getCountryFlag = (country: string) => {
//     const flagMap: Record<string, string> = {
//       'United States': '🇺🇸', 'Canada': '🇨🇦', 'United Kingdom': '🇬🇧', 'France': '🇫🇷',
//       'Germany': '🇩🇪', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Japan': '🇯🇵',
//       'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'China': '🇨🇳', 'India': '🇮🇳',
//       'Brazil': '🇧🇷', 'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'South Africa': '🇿🇦',
//       'Egypt': '🇪🇬', 'UAE': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Turkey': '🇹🇷'
//     };
//     return flagMap[country] || '🌍';
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <Button onClick={fetchPlans}>Try Again</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <AuthHeader />

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-balance mb-4">Choose Your Perfect eSIM Plan</h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//               Stay connected worldwide with our flexible data plans. Choose from regional packages or go global with unlimited coverage.
//             </p>
//           </div>

//           {/* Filters (unchanged) */}
//           <div className="mb-8">
//             {/* ... Filters code remains unchanged ... */}
//           </div>

//           {loading && (
//             <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Updating results...
//             </div>
//           )}

//           {/* Plans Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {plans.map((plan) => (
//               <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
//                 {plan.isPopular && (
//                   <div className="absolute top-4 right-4">
//                     <Badge className="bg-primary text-primary-foreground">
//                       <Star className="h-3 w-3 mr-1" />
//                       Popular
//                     </Badge>
//                   </div>
//                 )}

//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <CardTitle className="text-lg">{plan.planName || 'eSIM Plan'}</CardTitle>
//                       <CardDescription className="mt-2">
//                         {plan.locationName ? `Stay connected in ${plan.locationName}` : 'Stay connected worldwide'}
//                       </CardDescription>
//                     </div>
//                     {plan.category && (
//                       <Badge variant="secondary" style={{ backgroundColor: plan.category.color || undefined }}>
//                         {plan.category.name}
//                       </Badge>
//                     )}
//                   </div>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2">
//                       <Wifi className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">{plan.gbs ? `${plan.gbs}GB` : 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Clock className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">{plan.days ? `${plan.days} days` : 'N/A'}</span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                       <MapPin className="h-4 w-4" />
//                       <span>{plan.locationName || 'Global'}</span>
//                     </div>
//                     {plan.countryCodes && (
//                       <div className="flex flex-wrap gap-1">
//                         <span className="text-xs">
//                           {getCountryFlag(plan.locationName || '')} {plan.locationName}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {plan.features.length > 0 && (
//                     <div className="space-y-2">
//                       <p className="text-sm font-medium">Features:</p>
//                       <div className="flex flex-wrap gap-1">
//                         {plan.features.slice(0, 3).map((feature, index) => (
//                           <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
//                         ))}
//                         {plan.features.length > 3 && (
//                           <Badge variant="outline" className="text-xs">
//                             +{plan.features.length - 3} more
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* ✅ PriceDisplay here */}
//                   <div className="pt-4 border-t">
//                     <div className="flex items-baseline space-x-2">
//                       <span className="text-3xl font-bold">
//                         <PriceDisplay priceUSD={plan.price} />
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>

//                 <CardFooter className="pt-0">
//                   <Button onClick={() => addToCart(plan)} className="w-full" size="lg">
//                     <ShoppingCart className="h-4 w-4 mr-2" />
//                     Get This Plan
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>

//           {plans.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-medium mb-2">No plans found</h3>
//               <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Globe, Search, Filter, MapPin, Wifi, Clock, Star, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthHeader } from "../../components/auth-header";
import PriceDisplay from '../../components/PriceDisplay'; // ⬅️ Updated for currency

interface Plan {
  id: string;
  planName: string | null;
  planCategory: string | null;
  locationName: string | null;
  price: number;
  gbs: number | null;
  days: number | null;
  countryCodes: string | null;
  slug: string | null;
  planId: string | null;
  isPopular: boolean;
  features: string[];
  maxSpeed: string | null;
  status: string;
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
      countriesWithIso?: Array<{ name: string; iso: string | null }>;
      dataAmounts: string[];
      durations: number[];
    };
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCountries, setShowAllCountries] = useState(false);
  // Draft filters reflect UI controls; appliedFilters are sent to API
  const [draftFilters, setDraftFilters] = useState({
    search: '',
    categoryId: '',
    country: '',
    minPrice: '',
    maxPrice: '',
    dataAmount: '',
    duration: ''
  });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
  const defaultCountries = [
    'United States','United Kingdom','Japan','Italy','Spain','France','Canada','Portugal','Mexico','China','Greece','Turkey','Germany','South Korea','Ireland','Thailand','Iceland','Switzerland','India','Pakistan'
  ];
  const [countries, setCountries] = useState<string[]>(defaultCountries);
  const [countriesWithIso, setCountriesWithIso] = useState<Array<{ name: string; iso: string | null }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchFiltersOnly();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // On the main page, we no longer fetch plans by default
      params.set('limit', '0');
     
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
        setPlans(sortedPlans);
        setCategories(data.data.filters.categories);
        setCountries(data.data.filters.countries);
        if (data.data.filters.countriesWithIso) setCountriesWithIso(data.data.filters.countriesWithIso);
      } else {
        setError('Failed to fetch plans');
      }
    } catch (err) {
      setError('Failed to fetch plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersOnly = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('onlyFilters', 'true');
      const response = await fetch(`/api/plans?${params.toString()}`);
      const data: PlansResponse = await response.json();
      if (data.success) {
        setCategories(data.data.filters.categories);
        setCountries(data.data.filters.countries);
        if (data.data.filters.countriesWithIso) setCountriesWithIso(data.data.filters.countriesWithIso);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (plan: Plan) => {
    window.location.href = `/checkout?planId=${plan.id}`;
  };

  const applyFilters = () => {
    setAppliedFilters({ ...draftFilters });
  };

  const clearFilters = () => {
    const cleared = { search: '', categoryId: '', country: '', minPrice: '', maxPrice: '', dataAmount: '', duration: '' };
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setSuggestions([]);
  };

  const onSearchChange = (value: string) => {
    setDraftFilters({ ...draftFilters, search: value });
    if (!value) {
      setSuggestions([]);
      return;
    }
    const lower = value.toLowerCase();
    const countryMatches = countries.filter(c => c.toLowerCase().includes(lower)).slice(0, 6);
    const categoryMatches = categories.map(c => c.name).filter(name => name.toLowerCase().includes(lower)).slice(0, 4);
    setSuggestions([...countryMatches, ...categoryMatches]);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applyFilters();
  };

  const getCountryFlag = (country: string) => {
    // Robust country-to-flag mapper: supports full names, common aliases, and ISO 2-letter codes
    const flagMap: Record<string, string> = {
      'Afghanistan': '🇦🇫',
      'United States': '🇺🇸',
      'United States of America': '🇺🇸',
      'USA': '🇺🇸',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Australia': '🇦🇺',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Pakistan': '🇵🇰',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'South Africa': '🇿🇦',
      'Egypt': '🇪🇬',
      'UAE': '🇦🇪',
      'United Arab Emirates': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Turkey': '🇹🇷',
      'Portugal': '🇵🇹',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Greece': '🇬🇷',
      'Ireland': '🇮🇪',
      'Norway': '🇳🇴',
      'Sweden': '🇸🇪',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Iceland': '🇮🇸',
      'Poland': '🇵🇱',
      'Czech Republic': '🇨🇿',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Croatia': '🇭🇷',
      'Slovakia': '🇸🇰',
      'Slovenia': '🇸🇮',
      'Estonia': '🇪🇪',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Malta': '🇲🇹',
      'Cyprus': '🇨🇾',
      'Thailand': '🇹🇭',
      'Vietnam': '🇻🇳',
      'Singapore': '🇸🇬',
      'Malaysia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Sri Lanka': '🇱🇰',
      'Bangladesh': '🇧🇩',
      'Nepal': '🇳🇵',
      'New Zealand': '🇳🇿',
      'Chile': '🇨🇱',
      'Peru': '🇵🇪',
      'Colombia': '🇨🇴',
      'Uruguay': '🇺🇾',
      'Paraguay': '🇵🇾',
      'Bolivia': '🇧🇴',
      'Ecuador': '🇪🇨',
      'Morocco': '🇲🇦',
      'Tunisia': '🇹🇳',
      'Algeria': '🇩🇿',
      'Kenya': '🇰🇪',
      'Tanzania': '🇹🇿',
      'Nigeria': '🇳🇬',
      'Ghana': '🇬🇭',
      'Ethiopia': '🇪🇹',
      'Qatar': '🇶🇦',
      'Kuwait': '🇰🇼',
      'Bahrain': '🇧🇭',
      'Oman': '🇴🇲',
      'Jordan': '🇯🇴',
      'Lebanon': '🇱🇧',
      'Israel': '🇮🇱'
    };
    // Try ISO first from countriesWithIso
    const found = countriesWithIso.find((c) => c.name === country);
    if (found && found.iso && /^[A-Z]{2}$/.test(found.iso)) {
      const base = 127397;
      return found.iso
        .split('')
        .map((ch) => String.fromCodePoint(base + ch.charCodeAt(0)))
        .join('');
    }
    // Normalize: remove parentheses, extra spaces, title case
    const cleaned = country
      .replace(/\s*\([^)]*\)\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (flagMap[cleaned]) return flagMap[cleaned];
    // Try upper-case aliases
    const upper = cleaned.toUpperCase();
    if (flagMap[upper]) return flagMap[upper];
    // Handle common shortcodes mapping to ISO
    const aliasToIso: Record<string, string> = {
      'UAE': 'AE', 'U.K.': 'GB', 'UK': 'GB', 'USA': 'US', 'U.S.A.': 'US'
    };
    const isoGuess = aliasToIso[upper] || upper;
    // If looks like ISO alpha-2, convert to regional indicator flag
    if (/^[A-Z]{2}$/.test(isoGuess)) {
      const base = 127397; // 0x1F1E6 - 'A'
      const flag = isoGuess
        .split('')
        .map((ch) => String.fromCodePoint(base + ch.charCodeAt(0)))
        .join('');
      return flag;
    }
    return '🌍';
      'United States': '🇺🇸', 'Canada': '🇨🇦', 'United Kingdom': '🇬🇧', 'France': '🇫🇷',
      'Germany': '🇩🇪', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Japan': '🇯🇵',
      'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'China': '🇨🇳', 'India': '🇮🇳',
      'Brazil': '🇧🇷', 'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'South Africa': '🇿🇦',
      'Egypt': '🇪🇬', 'UAE': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Turkey': '🇹🇷'
    };
    return flagMap[country] || '🌍';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPlans}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-balance mb-4">Choose Your Perfect eSIM Plan</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay connected worldwide with our flexible data plans. Choose from regional packages or go global with unlimited coverage.
            </p>
          </div>

          {/* Filters (unchanged) */}
          <div className="mb-8">
            {/* ... Filters code remains unchanged ... */}
          </div>

          {loading && (
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating results...
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.planName || 'eSIM Plan'}</CardTitle>
                      <CardDescription className="mt-2">
                        {plan.locationName ? `Stay connected in ${plan.locationName}` : 'Stay connected worldwide'}
                      </CardDescription>
                    </div>
                    {plan.category && (
                      <Badge variant="secondary" style={{ backgroundColor: plan.category.color || undefined }}>
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
                      <span>{plan.locationName || 'Global'}</span>
                    </div>
                    {plan.countryCodes && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs">
                          {getCountryFlag(plan.locationName || '')} {plan.locationName}
          {/* Countries list with View All at bottom */}
          {countries.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Browse by Country</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(showAllCountries ? countries : countries.slice(0, 18)).map((country) => (
                  <Link
                    key={country}
                    href={`/plans/country/${encodeURIComponent(country.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="group"
                    onMouseEnter={() => {
                      // Prefetch first page into session cache for instant country load
                      try {
                        const cacheKey = `countryPlans:${country}:page:1`;
                        if (!sessionStorage.getItem(cacheKey)) {
                          const params = new URLSearchParams();
                          params.set('country', country);
                          params.set('limit', '24');
                          params.set('page', '1');
                          fetch(`/api/plans?${params.toString()}`)
                            .then((r) => r.json())
                            .then((d) => {
                              if (d?.success && Array.isArray(d.data?.plans)) {
                                sessionStorage.setItem(cacheKey, JSON.stringify(d.data.plans));
                              }
                            })
                            .catch(() => {});
                        }
                      } catch (_e) {}
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-md border hover:border-primary transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">
                          {getCountryFlag(country)}
                        </span>
                        <span className="text-sm truncate group-hover:text-primary">
                          {country}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => setShowAllCountries(!showAllCountries)}
                >
                  {showAllCountries ? 'Show less' : 'View all'}
                </Button>
              </div>
            </div>
          )}
                    )}
                  </div>

                  {plan.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                        {plan.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

          {/* No blocking loader on main page for instant paint */}

          {/* No plan cards on the main page; user navigates via countries */}

          {countries.length === 0 && !loading && (
                  {/* ✅ PriceDisplay */}
                  <div className="pt-4 border-t">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold">
                        <PriceDisplay priceUSD={Number(plan.price)} />
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button onClick={() => addToCart(plan)} className="w-full" size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Get This Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {plans.length === 0 && !loading && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No plans found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              <h3 className="text-lg font-medium mb-2">No countries found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
