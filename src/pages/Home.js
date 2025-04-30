import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Element } from 'react-scroll';
import Categories from '../components/Categories/Categories';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import Products from '../components/Products/Products';
import { getProducts } from '../services/getProducts';

const StyledBox = styled(Box)(({ theme }) => ({
    height: '1px',
    backgroundImage: `linear-gradient(to right, transparent, ${theme.palette.primary.main}, transparent)`,
    margin: theme.spacing(2, 0),
}));

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const top = 64;

    useEffect(() => {
        getProducts()
            .then((data) => {
                // Check if data exists and is an array before using map
                if (data && Array.isArray(data)) {
                    setProducts(data);
                    console.log(data);
                    // Safely extract categories
                    const categorySet = new Set(data.map((product) => product.category).filter(Boolean));
                    setCategories([...categorySet]);
                } else {
                    console.error('Data received is not an array:', data);
                    setProducts([]);
                    setCategories([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
                setCategories([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Container maxWidth="xl" sx={{ mt: top / 8 + 2 }}>
            <ImageSlider />
            {/* Only render Categories if categories array exists and has items */}
            {categories.length > 0 && <Categories categories={categories} />}
            
            {loading ? (
                <Typography variant="h6">Loading products...</Typography>
            ) : (
                <Grid container sx={{ display: 'block' }}>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <Element name={category} key={category}>
                                <Grid item xs={12} mt={4}>
                                    <StyledBox />
                                    <Grid item xs={12} mt={4}>
                                        <Typography variant="h4" component="h2" gutterBottom>{category}</Typography>
                                        <Products products={products.filter(product => product && product.category === category)} />
                                    </Grid>
                                </Grid>
                            </Element>
                        ))
                    ) : (
                        <Typography variant="h6">No products available</Typography>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default Home;