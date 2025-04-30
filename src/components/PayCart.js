import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions, styled, useTheme } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { makePayment } from '../services/makePayment';

const CartBox = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    borderRadius: 10,
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

const PayCart = ({ phoneNumber, name, address, description}) => {
    const cartItems = useSelector((state) => state.cart.items);
    const tax = useSelector((state) => state.cart.tax);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const theme = useTheme();

    const roundOff = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    const subtotal = roundOff(cartItems.reduce((total, item) => total + item.price * item.quantity, 0));
    const taxtotal = roundOff(subtotal + (subtotal * tax / 100));
    const deliveryCharges = 10;
    const grandTotal = roundOff(taxtotal + deliveryCharges);

    const makeOrder = () => {
        const order = {
            Customer_Name: name,
            Customer_Address: address,
            Customer_Phone: phoneNumber,
            Items: cartItems.map(item => ({
                Product: item._id,
                Quantity: item.quantity,
                Price: item.price,
            })),
            Total: subtotal,
            Grand_Total: grandTotal,
            GST: tax,
            Grand_Total: grandTotal,
            Ordered_From: 'Web',
            Branch_Name: 'I-8 Markaz',
            Comment: description || '',
            Delivery_Charges: deliveryCharges,
        };
        
        makePayment(order).then((response) => {
            if (response.status === 200) {
                navigate('/');
            }
        });
    }

    return (
        <CartBox>
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h5" color="text.primary">Your Cart</Typography>
            </Grid>
            <Box sx={{ height: '2px', backgroundColor: 'divider', my: 2 }} />
            <Box sx={{ flexGrow: 1, pb: 2, pr: 1, pl: 1 }}>
                {cartItems.map((item) => (
                    <CartCard key={item.id}>
                    <Grid container alignItems="stretch">
                        <Grid item xs={4}>
                            <CardMedia component="img" image={item.image} alt={item.name} />
                        </Grid>
                        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, mt: -2 }}>
                                <Typography variant="h6" noWrap>{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>{item.description}</Typography>
                                <Typography variant="body1" align="right">{item.price * item.quantity}</Typography>
                            </CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="flex-end">
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                                        <QuantityBox>{item.quantity}</QuantityBox>
                                    </Box>
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
                            <Button variant="contained" color="primary" fullWidth onClick={() => { makeOrder() }}>
                                Checkout
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </CartBox>
    );
};

export default PayCart;