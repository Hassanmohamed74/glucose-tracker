import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "Glucose Tracker - 20 Day Challenge",
  description: "Track your blood glucose with a 20-day finger rotation challenge",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
