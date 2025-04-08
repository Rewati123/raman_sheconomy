"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    setIsAuthenticated(!!token);
    if (!token) {
      router.push('/');
    }
  };

  useEffect(() => {
    checkAuth();
    // Add event listener for cookie changes
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isAuthenticated ? (
          children // Show the login page (which is the root page)
        ) : (
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
