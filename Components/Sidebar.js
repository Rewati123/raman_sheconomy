"use client";

import React from "react";
import Link from "next/link";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
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
          backgroundColor: "#f0f2f5", // Slightly lighter grey for a fresh look
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-20 bg-primary shadow-md">
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
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
    <ListItem
      button
      component={Link}
      href={href}
      sx={{
        "&:hover": {
          backgroundColor: "#e0e0e0", // Light hover effect
          borderRadius: "8px",
          transition: "background-color 0.3s ease",
        },
        padding: "12px 16px",
      }}
    >
      <ListItemIcon
        sx={{
          color: "#555", // Default icon color
          "&:hover": {
            color: "#1976d2", // Blue color on hover
            transition: "color 0.3s ease",
          },
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{
          fontWeight: 500,
          color: "#333", // Default text color
          "&:hover": {
            color: "#1976d2", // Blue color for text on hover
          },
        }}
      />
    </ListItem>
  );
};

export default Sidebar;
