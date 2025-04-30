import React from 'react';
import { Link } from 'react-scroll';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textWrap: 'nowrap',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
    },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    '&:hover': {
        fontWeight: 'bold',
    },
}));

const Category = ({ category, isSticky }) => (
    <Box display="inline-block" mt={1} mb={1} ml={isSticky ? 1 : 0} mr={isSticky ? 1 : 2}>
      <Link
        key={category}
        to={category}
        smooth={true}
        offset={isSticky ? -200 : -400}
        duration={500}
        role="button"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <StyledPaper>
          <StyledTypography variant="h6" component="div" sx={{ p: 1 }}>
            {category}
          </StyledTypography>
        </StyledPaper>
      </Link>
    </Box>
  );

export default Category;