// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "JPY";

// interface CurrencyContextProps {
//   currency: Currency;
//   setCurrency: (c: Currency) => void;
//   convert: (priceUSD: number) => number;
// }

// const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

// export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [currency, setCurrency] = useState<Currency>("USD");
//   const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });

//   useEffect(() => {
//     async function fetchRates() {
//       try {
//         const res = await fetch(`https://api.exchangerate.host/latest?base=USD`);
//         const data = await res.json();
//         setRates(data.rates);
//       } catch (error) {
//         console.error("Error fetching exchange rates:", error);
//       }
//     }
//     fetchRates();
//   }, []);

//   const convert = (priceUSD: number) => {
//     return rates[currency] ? priceUSD * rates[currency] : priceUSD;
//   };

//   return (
//     <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// };

// export const useCurrency = () => {
//   const context = useContext(CurrencyContext);
//   if (!context) {
//     throw new Error("useCurrency must be used within CurrencyProvider");
//   }
//   return context;
// };





// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "JPY";

// interface CurrencyContextProps {
//   currency: Currency;
//   setCurrency: (c: Currency) => void;
//   convert: (priceUSD: number) => number;
//   loading: boolean;
// }

// const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

// export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [currency, setCurrency] = useState<Currency>("USD");
//   const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchRates() {
//       try {
//         const res = await fetch(`https://api.exchangerate.host/latest?base=USD`);
//         const data = await res.json();
//         if (data && data.rates) {
//           setRates({ USD: 1, ...data.rates }); // Ensure USD always exists
//         }
//       } catch (error) {
//         console.error("Error fetching exchange rates:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRates();
//   }, []);

//   const convert = (priceUSD: number) => {
//     const rate = rates[currency];
//     if (typeof priceUSD !== "number" || isNaN(priceUSD)) return 0; // fallback if invalid
//     if (typeof rate !== "number" || isNaN(rate)) return priceUSD; // fallback if rate missing
//     return priceUSD * rate;
//   };

//   return (
//     <CurrencyContext.Provider value={{ currency, setCurrency, convert, loading }}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// };

// export const useCurrency = () => {
//   const context = useContext(CurrencyContext);
//   if (!context) {
//     throw new Error("useCurrency must be used within CurrencyProvider");
//   }
//   return context;
// };







// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "JPY";

// interface CurrencyContextProps {
//   currency: Currency;
//   setCurrency: (c: Currency) => void;
//   convert: (priceUSD: number) => number;
//   loading: boolean;
// }

// const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

// export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [currency, setCurrency] = useState<Currency>("USD");
//   const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchRates() {
//       try {
//         const res = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=USD,EUR,GBP,INR,AUD,CAD,JPY`);
//         const data = await res.json();
//         console.log("Rates response:", data.rates); // 👈 ADD HERE
//         if (data && data.rates) {
//           setRates({ USD: 1, ...data.rates }); // Ensure USD always exists
//         }
//       } catch (error) {
//         console.error("Error fetching exchange rates:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRates();
//   }, []);

//   const convert = (priceUSD: number) => {
//     const rate = rates[currency];
//     console.log("Converting", priceUSD, "with rate", rate, "for currency", currency); // 👈 add this
//     if (typeof priceUSD !== "number" || isNaN(priceUSD)) return 0; // fallback if invalid
//     if (typeof rate !== "number" || isNaN(rate)) return priceUSD; // fallback if rate missing
//     return priceUSD * rate;
//   };


//   return (
//     <CurrencyContext.Provider value={{ currency, setCurrency, convert, loading }}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// };

// export const useCurrency = () => {
//   const context = useContext(CurrencyContext);
//   if (!context) {
//     throw new Error("useCurrency must be used within CurrencyProvider");
//   }
//   return context;
// };









"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "JPY";

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (priceUSD: number) => number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("currency");
    if (saved && ["USD","EUR","GBP","INR","AUD","CAD","JPY"].includes(saved)) {
      return saved as Currency;
    }
    return "USD";
  });
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(`/api/currency/rates`, { cache: "no-store" });
        const data = await res.json();

        // API returns either {rates: {...}} or direct map, handle both
        const incoming = data?.rates ?? data;
        if (incoming) {
          setRates({
            USD: 1,
            EUR: incoming.EUR,
            GBP: incoming.GBP,
            INR: incoming.INR,
            AUD: incoming.AUD,
            CAD: incoming.CAD,
            JPY: incoming.JPY,
          });
        }
      } catch (error) {
        console.error("❌ Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currency", currency);
    }
  }, [currency]);

  const convert = (priceUSD: number) => {
    const rate = rates[currency];
    // console.log("🔄 Converting", priceUSD, "USD →", currency, "Rate:", rate);

    if (typeof priceUSD !== "number" || isNaN(priceUSD)) return 0;
    if (typeof rate !== "number" || isNaN(rate)) return priceUSD;

    return priceUSD * rate;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};
