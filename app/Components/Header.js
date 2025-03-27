"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Already logged out!");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Logged out successfully!");
        localStorage.removeItem("token");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Logout failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b relative">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="flex items-center">
        <Input type="text" placeholder="Search..." className="w-64 mr-4" />
        <Search className="text-gray-500 cursor-pointer" />
      </div>

      <div className="flex items-center relative">
        <button className="p-2 mr-4 text-gray-500 hover:text-gray-700">
          <Bell />
        </button>

        <div className="relative">
          <FaUserCircle
            className="w-8 h-8 text-gray-600 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <ul className="py-2">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
