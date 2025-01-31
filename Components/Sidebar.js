import React from 'react';
import Link from "next/link";
import { Home, Users, Calendar, Folder, Settings } from "lucide-react";
import { FaVideo } from 'react-icons/fa'
const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white shadow-lg">
      <div className="flex items-center justify-center h-20 shadow-md bg-gray-900">
  
        <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link
            href="/dashboard"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white px-4 rounded-lg"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Home />
            </span>
            <span className="text-sm font-medium hover:bg-white hover:text-gray-800 px-2 py-1 rounded-lg">
              Dashboard
            </span>
          </Link>
        </li>

        <li>
          <Link
            href="/program"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white px-4 rounded-lg"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
            <Folder />
            </span>
            <span className="text-sm font-medium hover:bg-white hover:text-gray-800 px-2 py-1 rounded-lg">
              Program
            </span>
          </Link>
        </li>

        <li>
          <Link
            href="/programvedio"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white px-4 rounded-lg"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
          
              <FaVideo /> 
            </span>
            <span className="text-sm font-medium hover:bg-white hover:text-gray-800 px-2 py-1 rounded-lg">
            ProgramVedio
            </span>
          </Link>
        </li>




        <li>
          <Link
            href="/user"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white px-4 rounded-lg"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Users />
            </span>
            <span className="text-sm font-medium hover:bg-white hover:text-gray-800 px-2 py-1 rounded-lg">
              Users
            </span>
          </Link>
        </li>

        <li>
          <Link
            href="/events"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white px-4 rounded-lg"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Calendar />
            </span>
            <span className="text-sm font-medium hover:bg-white hover:text-gray-800 px-2 py-1 rounded-lg">
              Events
            </span>
          </Link>
        </li>

        <li>
          <Link
            href="/settings"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white px-4 rounded-lg"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Settings />
            </span>
            <span className="text-sm font-medium hover:bg-white hover:text-gray-800 px-2 py-1 rounded-lg">
              Settings
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
