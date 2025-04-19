import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropWise With Lee",
  description: "An AI-Powered Real Estate Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.variable}  antialiased  pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
