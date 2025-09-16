// "use client";

// import React from "react";
// import { useCurrency } from "./CurrencyContext";

// interface PriceDisplayProps {
//   priceUSD: number;
// }

// const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceUSD }) => {
//   const { currency, convert } = useCurrency();
//   const convertedPrice = convert(priceUSD);

//   return (
//     <span>
//       {currency} {convertedPrice.toFixed(2)}
//     </span>
//   );
// };

// export default PriceDisplay;



// "use client";

// import React from "react";
// import { useCurrency } from "./CurrencyContext";

// interface PriceDisplayProps {
//   priceUSD: number;
// }

// const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceUSD }) => {
//   const { currency, convert, loading } = useCurrency();

//   if (loading) return <span>Loading...</span>;

//   const convertedPrice = convert(priceUSD);

//   return (
//     <span>
//       {currency} {isNaN(convertedPrice) ? "0.00" : convertedPrice.toFixed(2)}
//     </span>
//   );
// };

// export default PriceDisplay;






// "use client";

// import React from "react";
// import { useCurrency } from "./CurrencyContext";

// interface PriceDisplayProps {
//   priceUSD: number;
// }

// const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceUSD }) => {
//   const { currency, convert, loading } = useCurrency();

//   if (loading) return <span>Loading...</span>;

//   const convertedPrice = convert(priceUSD);

//   return (
//     <span>
//       {currency} {isNaN(convertedPrice) ? "0.00" : convertedPrice.toFixed(2)}
//     </span>
//   );
// };

// export default PriceDisplay;

"use client";

import React from "react";
import { useCurrency } from "./CurrencyContext";

interface PriceDisplayProps {
  priceUSD: number;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceUSD }) => {
  const { currency, convert, loading } = useCurrency();

  if (loading) return <span>Loading...</span>;

  const convertedPrice = convert(priceUSD);
  const symbol = currencySymbols[currency] || currency;

  return (
    <span>
      {symbol} {isNaN(convertedPrice) ? "0.00" : convertedPrice.toFixed(2)}
    </span>
  );
};

export default PriceDisplay;

