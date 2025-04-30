import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Product from './Product';

import { useMediaQuery } from '@mui/material';

const Products = ({ products: initialProducts }) => {
    const [products, setProducts] = useState(initialProducts);

    const handleFavoriteClick = (id) => {
        const newProducts = products.map(product =>
            product.id === id ? { ...product, isFavorite: !product.isFavorite } : product
        );
        setProducts(newProducts);
    };

    const isSmallScreen = useMediaQuery('(max-width:400px)');

    return (
        <Grid container display={'flex'} flexWrap={'wrap'} spacing={2}>
                {products.map((product, index) => (
                    <Grid item xs={isSmallScreen ? 12 : 6} sm={4} md={4} lg={3} xl={2} key={product.id} display={'flex'}>
                        <Product product={product} index={index} handleFavoriteClick={handleFavoriteClick} />
                    </Grid>
                ))}
            </Grid>
    );
};

export default Products;