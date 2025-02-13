import Link from "next/link";
import Login from "@/components/Login";
import { AuthProvider } from '../contexts/AuthContext';
import type { AppProps } from 'next/app';

export default function Home() {
  return (
    <>
      <Link
        href="/signup"
        className="flex items-center gap-5 absolute top-4 right-4 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
      >
        Sign up
      </Link>
      <Login />
    </>
  );
}
