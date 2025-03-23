import { SessionProvider } from "next-auth/react";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Peso",
  description: "Track your workout routines and progress",
  icons: {
    icon: '/logo.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <SessionProvider session={session}>
          <Navbar session={session} />
          <Toaster position="top-right" />

          <main className="container mx-auto py-6">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
