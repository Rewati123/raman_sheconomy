"use client";

import React from "react";
import Link from "next/link";
import { Home, Users, Calendar, Folder, Settings } from "lucide-react";
import { FaVideo } from "react-icons/fa";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils"; // अगर utils में `cn` function है तो इसे यूज़ करो

const Sidebar = () => {
  return (
    <Card className="w-64 h-screen bg-background text-foreground shadow-lg flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-20 bg-secondary shadow-md">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>

      {/* Sidebar Menu */}
      <CardContent className="flex flex-col py-4 space-y-2">
        <SidebarItem href="/dashboard" icon={<Home size={20} />} text="Dashboard" />
        <SidebarItem href="/program" icon={<Folder size={20} />} text="Program" />
        <SidebarItem href="/programvedio" icon={<FaVideo size={20} />} text="Program Video" />
        <SidebarItem href="/user" icon={<Users size={20} />} text="Users" />
        <SidebarItem href="/events" icon={<Calendar size={20} />} text="Events" />
        <SidebarItem href="/settings" icon={<Settings size={20} />} text="Settings" />
      </CardContent>
    </Card>
  );
};

/* ✅ Reusable Sidebar Item Component */
const SidebarItem = ({ href, icon, text }) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 h-12 px-4 rounded-md transition-all duration-200 ease-in-out",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="w-10 h-10 flex items-center justify-center text-lg">
        {icon}
      </span>
      <span className="text-sm font-medium">{text}</span>
    </Link>
  );
};

export default Sidebar;
