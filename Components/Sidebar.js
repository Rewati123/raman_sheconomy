import React from "react";
import Link from "next/link";
import { Home, Users, Calendar, Folder, Settings } from "lucide-react";
import { FaVideo } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen shadow-lg flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-20 bg-gray-800 shadow-md">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>

      {/* Sidebar Menu */}
      <ul className="flex flex-col py-4 space-y-2">
        {/* Dashboard */}
        <SidebarItem href="/dashboard" icon={<Home />} text="Dashboard" />
        
        {/* Program */}
        <SidebarItem href="/program" icon={<Folder />} text="Program" />
        
        {/* Program Video */}
        <SidebarItem href="/programvedio" icon={<FaVideo />} text="Program Video" />
        
        {/* Users */}
        <SidebarItem href="/user" icon={<Users />} text="Users" />
        
        {/* Events */}
        <SidebarItem href="/events" icon={<Calendar />} text="Events" />
        
        {/* Settings */}
        <SidebarItem href="/settings" icon={<Settings />} text="Settings" />
      </ul>
    </div>
  );
};

/* ✅ Reusable Sidebar Item Component */
const SidebarItem = ({ href, icon, text }) => {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center space-x-3 h-12 px-4 rounded-lg transition-all duration-200 ease-in-out text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <span className="w-10 h-10 flex items-center justify-center text-lg">
          {icon}
        </span>
        <span className="text-sm font-medium">{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
