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
  title: "Soar Task - Financial Dashboard",
  description: "A financial dashboard for managing your finances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <AppProvider>
            <div className="flex h-screen p-0">
              <Suspense
                fallback={
                  <div className="w-64 h-screen bg-background animate-pulse" />
                }
              >
                <Sidebar />
              </Suspense>
              <div className="flex flex-col flex-1 overflow-hidden">
                <Suspense
                  fallback={
                    <div className="h-20 w-full bg-background animate-pulse" />
                  }
                >
                  <Header />
                </Suspense>
                <main className="flex-1 overflow-auto p-8 bg-mainBackground">
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
