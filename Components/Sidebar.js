"use client";

import React from "react";
import Link from "next/link";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import { Home, People, Event, Folder, Settings } from "@mui/icons-material";
import { FaVideo } from "react-icons/fa";

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5", // light grey background for the sidebar
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-20 bg-secondary shadow-md">
        <Typography variant="h6" sx={{ color: "#000" }}>
          Admin Panel
        </Typography>
      </div>

      {/* Sidebar Menu */}
      <List>
        <SidebarItem href="/dashboard" icon={<Home />} text="Dashboard" />
        <SidebarItem href="/program" icon={<Folder />} text="Program" />
        <SidebarItem href="/programvedio" icon={<FaVideo size={20} />} text="Program Video" />
        <SidebarItem href="/user" icon={<People />} text="Users" />
        <SidebarItem href="/events" icon={<Event />} text="Events" />
        <SidebarItem href="/settings" icon={<Settings />} text="Settings" />
      </List>
    </Drawer>
  );
};

/* ✅ Reusable Sidebar Item Component */
const SidebarItem = ({ href, icon, text }) => {
  return (
    <ListItem button component={Link} href={href}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

export default Sidebar;
