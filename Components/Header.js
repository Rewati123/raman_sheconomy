import React from 'react';
import { Bell, Search } from 'lucide-react';
import { TextField, IconButton, Avatar, Badge } from '@mui/material';
import { Search as MSearch, Notifications } from '@mui/icons-material';

const Header = () => {
  return (
    <div>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-md">
        {/* Search Section */}
        <div className="flex items-center space-x-2">
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            className="w-64"
            InputProps={{
              startAdornment: (
                <MSearch sx={{ color: '#555', marginRight: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                '&:hover': {
                  borderColor: '#4caf50',
                },
              },
            }}
          />
        </div>

        {/* Notification and User Avatar Section */}
        <div className="flex items-center space-x-6">
          <IconButton className="relative">
            <Badge badgeContent={4} color="error">
              <Notifications sx={{ color: '#555', fontSize: 28 }} />
            </Badge>
          </IconButton>
          <Avatar
            alt="User avatar"
            src="/placeholder.svg?height=32&width=32"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '2px solid #fff',
              '&:hover': {
                cursor: 'pointer',
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease-in-out',
              },
            }}
          />
        </div>
      </header>
    </div>
  );
};

export default Header;
