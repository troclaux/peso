import { SessionProvider } from "next-auth/react";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import Link from "next/link";
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
  description: "Your app description",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <Link href="/" className="text-lg font-bold hover:underline">Peso</Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/workouts" className="hover:underline">
                Workouts
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              {session ? (
                <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
              ) : (
                <Link href="/api/auth/signin">Sign in</Link>
              )}
            </div>
          </nav>

          <main className="p-4">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
