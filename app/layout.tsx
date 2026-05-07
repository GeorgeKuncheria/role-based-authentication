import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./provider/AuthProvider";


export const metadata: Metadata = {
  title: "Team Access Control",
  description: "Role-based access control built with Next.js 16 and Prisma",
  keywords: ['team','access control'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-slate-950 text-slate">
            <AuthProvider>
                {children}
            </AuthProvider>
          </body>
    </html>
  );
}
