import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, addToCart, removeItemFromCart, addTax } from '../reduxes/CartSlice';
import { Box, Typography, Button, Grid, Card, IconButton, CardMedia, CardContent, CardActions, Drawer, styled, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getTax } from '../services/getTax';

import { useNavigate } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background.default,
    },
}));

const CartBox = styled(Box)(({ theme }) => ({
    width: '25vw',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    zIndex: 2000,
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
}));

const ClearButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    textDecoration: 'underline',
    fontWeight: 'bold',
}));

const CartCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
}));

const QuantityBox = styled(Box)(({ theme }) => ({
    width: theme.spacing(2),
    height: theme.spacing(2),
    border: `1px solid ${theme.palette.text.secondary}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    fontSize: theme.typography.h6.fontSize,
}));

const Cart = ({ isOpen, closeCart }) => {
    const cartItems = useSelector((state) => state.cart.items);
    const tax = useSelector((state) => state.cart.tax);
    const dispatch = useDispatch();
    const theme = useTheme();

    const navigate = useNavigate();

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('md'));

    const handleRemove = (item) => {
        dispatch(removeFromCart(item));
    };

    const handleClear = () => {
        dispatch(clearCart());
    };

    const handleAdd = (item) => {
        dispatch(addToCart(item));
    };

    const handleRemoveItem = (item) => {
        dispatch(removeItemFromCart(item));
    };

    const roundOff = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    useEffect(() => {
        if(tax === null) {
            getTax().then(taxValue => {
                dispatch(addTax(taxValue));
                console.log(taxValue);
            });
        }
    }, []);

    const subtotal = roundOff(cartItems.reduce((total, item) => total + item.price * item.quantity, 0));
    const taxtotal = roundOff(subtotal + (subtotal * tax / 100));
    const deliveryCharges = 10;
    const grandTotal = roundOff(taxtotal + deliveryCharges);

    if (cartItems.length === 0) {
        return (
            <StyledDrawer anchor="right" open={isOpen} onClose={closeCart}>
                <IconButton onClick={closeCart} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2001 }}>
                    <CloseIcon />
                </IconButton>
                <CartBox sx={{ alignItems: 'center', justifyContent: 'center', gap: 2, width: isSmallScreen ? '100vw' : '35vw', marginTop: 4 }}>
                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Looks like you haven't added anything to your cart yet
                    </Typography>
                </CartBox>
            </StyledDrawer>
        );
    }

    return (
        <StyledDrawer anchor="right" open={isOpen} onClose={closeCart}>
            <IconButton onClick={closeCart} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2001 }}>
                <CloseIcon />
            </IconButton>
            <CartBox sx={{ width: isSmallScreen ? '100vw' : '35vw', marginTop: 4 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" color="text.primary">Your Cart</Typography>
                    <ClearButton onClick={handleClear}>
                        <Typography variant="h6">Clear</Typography>
                    </ClearButton>
                </Grid>
                <Box sx={{ height: '2px', backgroundColor: 'divider', my: 2 }} />
                <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 2, pr: 1, pl: 1 }}>
                    {cartItems.map((item) => (
                        <CartCard key={item.id}>
                            <Grid container alignItems="stretch">
                                <Grid item xs={4}>
                                    <CardMedia 
                                        component="img" 
                                        image={item.image} 
                                        alt={item.name} 
                                        sx={{ 
                                            objectFit: 'cover',
                                            borderBottomRightRadius: '10%',
                                        }} 
                                    />
                                </Grid>
                                <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1, mt: -2 }}>
                                        <Typography variant="h6" noWrap>{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" >{item.description}</Typography>
                                        <Typography variant="h6" align="right">{item.price * item.quantity}</Typography>
                                    </CardContent>
                                    <Box display="flex" flexDirection="column" justifyContent="flex-end">
                                        <CardActions sx={{ justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                                                <IconButton color="secondary" onClick={() => handleRemove(item)}><RemoveIcon /></IconButton>
                                                <QuantityBox>{item.quantity}</QuantityBox>
                                                <IconButton color="secondary" onClick={() => handleAdd(item)}><AddIcon /></IconButton>
                                            </Box>
                                            <IconButton color="secondary" onClick={() => handleRemoveItem(item)}><DeleteIcon /></IconButton>
                                        </CardActions>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CartCard>
                    ))}
                </Box>
                <Box sx={{ pt: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        height: '100%',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            width: '100%',
                            borderBottom: '1px solid',
                            borderColor: theme.palette.divider,
                        }
                    }}>
                        <Grid container direction="column" gap={0.5} sx={{ mt: 2 }}>
                            <Grid item container justifyContent="space-between">
                                <Typography variant="h6">Subtotal:</Typography>
                                <Typography variant="h6" color="text.secondary">{subtotal}</Typography>
                            </Grid>
                            <Grid item container justifyContent="space-between">
                                <Typography variant="h6">Total after {tax}% GST:</Typography>
                                <Typography variant="h6" color="text.secondary">{taxtotal}</Typography>
                            </Grid>
                            <Grid item container justifyContent="space-between">
                                <Typography variant="h6">Delivery Charges:</Typography>
                                <Typography variant="h6" color="text.secondary">{deliveryCharges}</Typography>
                            </Grid>
                            <Grid item container justifyContent="space-between">
                                <Typography variant="h6" fontWeight="bold">Grand Total:</Typography>
                                <Typography variant="h6" color="text.secondary" fontWeight="bold">{grandTotal}</Typography>
                            </Grid>
                            <Grid>
                                <Button variant="contained" color="primary" fullWidth onClick={() => { closeCart(); navigate('/payment') }}>
                                    Checkout
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </CartBox>
        </StyledDrawer>
    );
};

export default Cart;