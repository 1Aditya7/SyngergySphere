import "../globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";


import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased")}>
        {children}
        {/* Sonner renders client-side portals */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
