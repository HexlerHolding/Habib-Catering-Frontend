import React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

const UserMenu = ({ anchorEl, handleClose }) => {

  const menuItems = [
    { label: 'Favorites', onClick: () => console.log('Favorites') },
    { label: 'Logout', onClick: () => console.log('Logout') },
  ];

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {menuItems.map((item, index) => (
        <MenuItem key={index} onClick={item.onClick} sx={{ '&:hover': { backgroundColor: 'primary.text.main' } }}>
          <Typography variant="body1">{item.label}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default UserMenu;