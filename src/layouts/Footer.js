import React from 'react';
import { Box, Typography, Link, Grid, IconButton, Avatar } from '@mui/material';
import { Facebook, Instagram, Phone, Email, Schedule, Download } from '@mui/icons-material';
import { LocationOn } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  height: '2px',
  backgroundColor: theme.palette.text.primary,
  margin: theme.spacing(2, 0),
}));


const Footer = () => {
  const brandImage = "https://yourwebsite.com/path/to/brand/image.jpg";
  const phoneNumber = "051111446699";
  const email = "support@cheezious.com";
  const address = "Cheezious - F-7, Beside Standard Charterd Bank, Bhatai Road, F-7, Islamabad, Islamabad";
  const days = ['Monday - Thursday', 'Friday', 'Saturday - Sunday'];
  const timings = [
    { day: days[0], time: '11:00 AM - 03:00 AM' },
    { day: days[1], time: '02:00 PM - 03:00 AM' },
    { day: days[2], time: '11:00 AM - 03:00 AM' }
  ];
  const socialLinks = [
    { platform: 'facebook', url: 'https://www.facebook.com/yourpage' },
    { platform: 'instagram', url: 'https://www.instagram.com/yourpage' }
  ];
  const appLinks = [
    { platform: 'Android', url: 'download-android-app' },
    { platform: 'iOS', url: 'download-ios-app' }
  ];
  return (
    <Box mt={5} py={3} px={5} bgcolor="primary.main">
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={2} align="center">
          <Avatar src={brandImage} alt="Brand" sx={{ width: 60, height: 60, mb: 2 }} />
        </Grid>
        <Grid item xs={12} md={6} align="center">
          <Typography variant="h6" align="start" mb={1}>Wrap Spot</Typography>
          <Grid container direction="row" alignItems="center">
            <Grid item mr={2}>
              <Phone color="inherit" />
            </Grid>
            <Grid item>
              <Typography variant="body1">{phoneNumber}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center">
            <Grid item mr={2}>
              <Email color="inherit" />
            </Grid>
            <Grid item>
              <Typography variant="body1">{email}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="flex-start">
            <Grid item mr={2}>
              <LocationOn color="inherit" />
            </Grid>
            <Grid item xs mt={0.5}>
              <Box alignSelf="flex-start">
                <Typography variant="body1" align='start'>{address}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="h6" align="start" mt={1} mb={1}>Download Our App</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {appLinks.map((link, index) => (
              <Box key={index} display="flex" alignItems="center" justifyContent="center">
                <Download color="inherit" />
                <Link href={link.url} color="inherit">
                  <Typography variant="body1">{link.platform}</Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={4} align="center">
        <Typography variant="h6" align="start" mb={1}>Our Timings</Typography>
        {timings.map((time, index) => (
          <Box display="flex" alignItems="center" key={index}>
            <Box mr={2}>
              <Schedule color="inherit" />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body1">{time.day}</Typography>
              <Typography variant="body1">{time.time}</Typography>
            </Box>
          </Box>
        ))}
          <Typography variant="h6" align="start" mt={1}>Follow Us:</Typography>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            {socialLinks.map((link, index) => (
              <IconButton key={index} color="inherit" href={link.url}>
                {link.platform === 'facebook' ? <Facebook /> : <Instagram />}
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Box mt={3}>
        <StyledBox />
      </Box>
      <Typography variant="body1" align="center" mt = {3}>
        © 2024 Your Company
      </Typography>
    </Box>
  );
};

export default Footer;