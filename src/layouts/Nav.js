import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cart from '../components/Cart';
import { Badge, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import UserMenu from '../components/UserMenu';
import { useLocation } from 'react-router-dom';
import LoginPopup from '../components/Login';
import LocationPopup from '../components/Location';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useMediaQuery, useTheme } from '@mui/material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const locationSelect = useSelector(state => state.location?.branch);

  const location = useLocation();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleMenu = (event) => {
    if (!user) {
      setIsLoginOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleLocationClose = () => {
    setIsLocationOpen(false);
  };

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant={isMobile ? 'body1' : 'h6'} component="div">
                Your Brand
              </Typography>
            </Box>
          )}
          <Box sx={{ flexGrow: isMobile ? 1 : 0, display: 'flex'}}>
            <IconButton color="inherit" onClick={() => setIsLocationOpen(true)}>
              <LocationOnIcon fontSize='large' color='secondary' />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: -1 }}>
              <Typography variant={isMobile ? 'body1' : 'h6'}>Deliver to</Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'}>{locationSelect}</Typography>
            </Box>
          </Box>
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6" component="div">
                Your Brand
              </Typography>
            </Box>
          )}
          <IconButton color="inherit" onClick={handleMenu}>
            <AccountCircleIcon fontSize='large' />
          </IconButton>
          {location.pathname !== '/payment' && (
            <IconButton color="inherit" onClick={toggleCart}>
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon fontSize='large' />
              </Badge>
            </IconButton>
          )}

        </Toolbar>
      </AppBar>
      {isCartOpen && <Cart isOpen={isCartOpen} closeCart={toggleCart} />}
      {anchorEl && <UserMenu anchorEl={anchorEl} handleClose={handleClose} />}
      {isLoginOpen && <LoginPopup open={isLoginOpen} handleClose={handleLoginClose} />}
      {isLocationOpen && <LocationPopup open={isLocationOpen} handleClose={handleLocationClose} />}
    </>
  );
};

export default Navbar;