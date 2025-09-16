// import type React from "react"
// import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
// import { Suspense } from "react"
// import { LiveChatWidget } from "../components/live-chat"
// import { TawkToWidget } from "../components/tawk-to-widget"
// import { AuthProvider } from "../components/providers/session-provider"
// import { ToasterProvider } from "../components/providers/toaster-provider"
// import "./globals.css"

// export const metadata: Metadata = {
//   title: "eSIM Global - Stay Connected Anywhere",
//   description:
//     "Get instant mobile data in 200+ countries with premium eSIM plans. No roaming fees, no physical SIM cards, just seamless connectivity.",
//   keywords: "eSIM, mobile data, travel, roaming, connectivity, global, international",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         <AuthProvider>
//           <Suspense fallback={null}>
//             {children}
//           </Suspense>

//           {/* Inject Tawk.to widget */}
//           <TawkToWidget 
//             propertyId={process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID!}
//             widgetId={process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID!}
//             userEmail={process.env.NEXT_PUBLIC_TAWK_TO_USER_EMAIL}
//             userName={process.env.NEXT_PUBLIC_TAWK_TO_USER_NAME}
//           />

//           {/* Our custom chat button */}
//           <LiveChatWidget />

//           <Analytics />
//           <ToasterProvider />
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }




import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { LiveChatWidget } from "../components/live-chat";
import { TawkToWidget } from "../components/tawk-to-widget";
import { AuthProvider } from "../components/providers/session-provider";
import { ToasterProvider } from "../components/providers/toaster-provider";
import { CurrencyProvider } from "../components/CurrencyContext"; // ⬅️ Add this
import "./globals.css";

export const metadata: Metadata = {
  title: "eSIM Global - Stay Connected Anywhere",
  description:
    "Get instant mobile data in 200+ countries with premium eSIM plans. No roaming fees, no physical SIM cards, just seamless connectivity.",
  keywords: "eSIM, mobile data, travel, roaming, connectivity, global, international",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CurrencyProvider>
          <AuthProvider>
            {children}
            {/* Inject Tawk.to widget */}
            <TawkToWidget
              propertyId={process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID!}
              widgetId={process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID!}
              userEmail={process.env.NEXT_PUBLIC_TAWK_TO_USER_EMAIL}
              userName={process.env.NEXT_PUBLIC_TAWK_TO_USER_NAME}
            />

            {/* Our custom chat button */}
            <LiveChatWidget />

            <Analytics />
            <ToasterProvider />
          </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}

