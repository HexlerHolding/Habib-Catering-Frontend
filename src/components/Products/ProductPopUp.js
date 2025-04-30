import React, { useState } from 'react';
import { Grid, CardMedia, Button, Typography, Dialog, DialogContent, Box, FormControl, FormControlLabel, Checkbox, DialogTitle, IconButton, FormGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addToCart } from '../../reduxes/CartSlice';
import { useDispatch } from 'react-redux';

const ProductPopUp = ({ product, open, handleClose }) => {
    const [selectedCombos, setSelectedCombos] = useState({});
    const dispatch = useDispatch();

    const handleComboChange = (event) => {
        setSelectedCombos({ ...selectedCombos, [event.target.name]: event.target.checked });
    };

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 3, top: 3 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={12} sm={6}>
                        <CardMedia
                            component="img"
                            sx={{ height: '100%', objectFit: 'cover'}}
                            image={product.image}
                            alt={product.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column">
                        <Box sx={{ flexGrow: 1 }}>
                            <Box mb={2}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                            </Box>
                            <Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </Box>
                            <Box mb={2}>
                                <Typography variant="h6">
                                    ${product.price}
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" justifyContent="flex-end">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <FormControl component="fieldset">
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={selectedCombos['Combo 1']} onChange={handleComboChange} name="Combo 1" />} label="Combo 1" />
                                    </FormGroup>
                                </FormControl>
                                <Typography variant="body1" color="text.secondary">
                                    ${product.price}
                                </Typography>
                            </Box>
                            <Button variant="contained" color="primary" fullWidth onClick={() => handleAddToCart()}> Add to Cart </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ProductPopUp;