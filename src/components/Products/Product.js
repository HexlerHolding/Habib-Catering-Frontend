import React, { useState } from 'react';
import ProductPopUp from './ProductPopUp';
import { Card, CardContent, CardMedia, Button, Typography, CardActions, IconButton, Box, Grid, Divider } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useMediaQuery, useTheme } from '@mui/material';

const Product = ({ product, handleFavoriteClick }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const theme = useTheme();

    const is400 = useMediaQuery('(max-width:400px)');
    const is500 = useMediaQuery('(max-width:500px)');
    const is600 = useMediaQuery('(max-width:600px)');
    const is700 = useMediaQuery('(max-width:700px)');
    const is800 = useMediaQuery('(max-width:800px)');
    const is900 = useMediaQuery('(max-width:900px)');

    const grRow = is400 ? 'auto' : is500 ? '1fr' : is600 ? '0.8fr' : is700 ? '1fr' : is800 ? '0.9fr' : is900 ? '0.8fr' : '0.6fr';

    return (
        <Card sx={{
            display: 'flex',
    flexDirection: 'column',
            border: '2px solid',
            height: '100%',
            borderColor: 'transparent',
            borderRadius: 2,
            padding: 1,
            cursor: 'pointer',
            ":hover": {
                borderColor: 'primary.main',
            }
        }}>
            <Box sx={{
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                height: '60%',
            }}>
                <CardMedia
                    component="img"
                    sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                    }}
                    image={product.image}
                    alt={product.name}
                />
                <IconButton
                    aria-label="add to favorites"
                    onClick={() => handleFavoriteClick(product.id)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 5,
                        color: product.isFavorite ? 'primary.main' : 'inherit',
                        backgroundColor: 'background.default',
                        '&:hover': {
                            backgroundColor: 'background.default',
                            color: 'primary.main'
                        }
                    }}
                >
                    {product.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Box>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <Typography gutterBottom variant="h5" component="div" marginBottom={0} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center',
                    }}
                >
                    {product.description}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center" width="100%">
                    <Box width="100%" mb={2}>
                        <Divider sx={{ borderColor: theme => theme.palette.grey[300] }} />
                    </Box>
                    <Typography variant="h6">
                        ${product.price}
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={() => handleOpen()}> Add to Cart </Button>
                </Box>
            </CardActions>
            {open && <ProductPopUp product={product} open={open} handleClose={handleClose} />}
        </Card>
    )
};

export default Product;