import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/app-context";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SOAR Dashboard | Manage Your Finances",
  description:
    "A comprehensive financial dashboard for managing your finances, cards, and transactions",
  keywords: ["fintech", "dashboard", "finances", "banking", "transactions"],
  authors: [{ name: "Soar Task Team" }],
  openGraph: {
    title: "Fintech Dashboard | Soar Task",
    description: "Manage your finances with our comprehensive dashboard",
    type: "website",
    siteName: "Soar Task Fintech",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
          defaultTheme="light"
        >
          <AppProvider>
            <div className="flex h-screen p-0">
              {/* <Suspense fallback={<div className="h-screen w-64 animate-pulse bg-background" />}>
                <Sidebar />
              </Suspense> */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* <Suspense fallback={<div className="h-20 w-full animate-pulse bg-background" />}>
                  <Header />
                </Suspense> */}
                <main className="page-transition smooth-scroll flex-1 overflow-auto bg-mainBackground p-8">
                  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
                </main>
              </div>
            </div>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
