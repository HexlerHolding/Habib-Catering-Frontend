import React, { useEffect, useRef } from 'react';
import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import Category from './Category';

const Categories = ({ categories }) => {
    const ref = useRef(null);
    const sentinelRef = useRef(null);
    const [isSticky, setSticky] = React.useState(false);

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    const top = isSm ? 56 : 64;

    const handleScroll = () => {
        if (ref.current && sentinelRef.current) {
            const sentinelTop = sentinelRef.current.getBoundingClientRect().top;
            const boxTop = ref.current.getBoundingClientRect().top;
            setSticky(sentinelTop < top && boxTop <= top);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isXs]);

    return (
        <>
            <div ref={sentinelRef} />
            <Container
                ref={ref}
                sx={{
                    position: isSticky ? 'fixed' : 'relative',
                    top: isSticky ? top : 'auto',
                    left: isSticky ? 0 : 'auto',
                    zIndex: 1,
                    bgcolor: 'background.default',
                    width: '100%',
                    maxWidth: 'none !important',
                    padding: 0,
                }}
            >
                <Grid container
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: (isSticky || isMd) ? 'auto' : 'visible',
                        flexWrap: (isSticky || isMd) ? 'nowrap' : 'wrap',
                        justifyContent: (isSticky || isMd) ? 'flex-start' : 'center',
                    }}
                >
                    {categories.map((category) => (
                        <Category category={category} isSticky={isSticky} />
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default Categories;