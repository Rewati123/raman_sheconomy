import React from 'react';
import { Bell, Search } from 'lucide-react';
import { TextField, IconButton, Avatar } from '@mui/material';
import { Search as MSearch, Notifications } from '@mui/icons-material';

const Header = () => {
  return (
    <div>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        {/* Search Section */}
        <div className="flex items-center">
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            className="mr-4"
            InputProps={{
              startAdornment: (
                <MSearch sx={{ color: 'gray', marginRight: 1 }} />
              ),
            }}
          />
        </div>

        {/* Notification and User Avatar Section */}
        <div className="flex items-center">
          <IconButton className="mr-4">
            <Notifications sx={{ color: 'gray' }} />
          </IconButton>
          <Avatar
            alt="User avatar"
            src="/placeholder.svg?height=32&width=32"
            sx={{ width: 32, height: 32 }}
          />
        </div>
      </header>
    </div>
  );
};

export default Header;
