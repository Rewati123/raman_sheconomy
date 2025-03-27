"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Login from "./Components/Login";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Default `null`
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return null; // Jab tak check ho raha hai tab blank screen rahe
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {isAuthenticated ? (
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                {children}
              </main>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </body>
    </html>
  );
}
