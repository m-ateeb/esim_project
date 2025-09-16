// "use client"

// import { Button } from "./ui/button"
// import { Globe } from "lucide-react"
// import Link from "next/link"
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
// import { useAuth } from "../../lib/hooks/useAuth"
// import GoogleTranslate from "./GoogleTranslate"

// interface AuthHeaderProps {
//   showAuthButtons?: boolean
// }

// export function AuthHeader({ showAuthButtons = true }: AuthHeaderProps) {
//   const { session, logout } = useAuth()
//   const user = session?.user
//   return (
//     <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center space-x-2">
//             <Link href="/" className="inline-flex items-center space-x-2">
//               <Globe className="h-8 w-8 text-primary" />
//               <span className="text-xl font-bold text-foreground">eSIM Global</span>
//             </Link>
//           </div>

//           <nav className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-foreground hover:text-primary transition-colors">
//               Home
//             </Link>
//             <Link href="/plans" className="text-foreground hover:text-primary transition-colors">
//               Plans
//             </Link>
//             <Link href="/about" className="text-foreground hover:text-primary transition-colors">
//               About
//             </Link>
//             <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
//               Contact
//             </Link>

//             {/* 🌍 Google Translate dropdown */}
//             <GoogleTranslate />
//           </nav>

//           {showAuthButtons && (
//             <div className="flex items-center space-x-4">
//               {!user ? (
//                 <>
//                   <Button variant="ghost" asChild>
//                     <Link href="/login">Sign In</Link>
//                   </Button>
//                   <Button asChild>
//                     <Link href="/register">Get Started</Link>
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Link href="/dashboard" className="inline-flex items-center space-x-2">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
//                       <AvatarFallback>{(user.name?.[0] || "U").toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm font-medium">{user.name || user.email}</span>
//                   </Link>
//                   <Button variant="outline" className="bg-transparent" onClick={() => logout()}>
//                     Sign out
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }


"use client";

import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../../lib/hooks/useAuth";
import { useCurrency } from "./CurrencyContext"; // ⬅️ Import CurrencyContext
import GoogleTranslate from "./GoogleTranslate"

interface AuthHeaderProps {
  showAuthButtons?: boolean;
}

export function AuthHeader({ showAuthButtons = true }: AuthHeaderProps) {
  const { session, logout } = useAuth();
  const user = session?.user;
  const { currency, setCurrency } = useCurrency(); // ⬅️ Get currency state

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">eSIM Global</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/plans" className="text-foreground hover:text-primary transition-colors">
              Plans
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>

            {/* 🌍 Google Translate dropdown */}
            <GoogleTranslate />

            {/* 🌍 Currency Dropdown */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="border p-1 rounded"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              <option value="JPY">JPY</option>
            </select>
          </nav>

          {showAuthButtons && (
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="inline-flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback>{(user.name?.[0] || "U").toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </Link>
                  <Button variant="outline" className="bg-transparent" onClick={() => logout()}>
                    Sign out
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
