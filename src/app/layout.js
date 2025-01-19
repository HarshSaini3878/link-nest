"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Provider } from "../components/ui/provider";
import { BackgroundProvider } from '../context/BackgroundContext'; // Import BackgroundProvider

// Import Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the entire app in the SessionProvider and BackgroundProvider */}
        <SessionProvider>
          <BackgroundProvider> {/* Apply BackgroundProvider here */}
            <Provider>{children}</Provider>
          </BackgroundProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
