import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Button, Typography, Box, InputAdornment, Select, MenuItem, FormControl, InputLabel, Grid, IconButton, DialogTitle } from '@mui/material';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import InputMask from 'react-input-mask';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch } from 'react-redux';
import { setUser } from '../reduxes/UserSlice';

import AlertComponent from './Alert';

const StyledTextField = styled(TextField)(({ theme }) => ({
    fontSize: '1rem',
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.background.paper,
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '& fieldset': {
            borderColor: theme.palette.divider,
        },
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
        "&& fieldset": {
            borderColor: theme.palette.primary.main,
        }
    }
}));

const LoginPopup = ({ open, handleClose }) => {
    const [contryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorPhoneNumber, setPhoneNumberError] = useState('');
    const [errorCountryCode, setCountryCodeError] = useState('');

    const dispatch = useDispatch();

    const handleLogin = () => {
        if (!contryCode) {
            setCountryCodeError('Please select your country code');
            setTimeout(() => {
                setCountryCodeError('');
            }, 2000);
            return;
        }
        if (!phoneNumber) {
            setPhoneNumberError('Please enter your phone number');
            setTimeout(() => {
                setPhoneNumberError('');
            }, 2000);
            return;
        }
        dispatch(setUser({ phoneNumber }));
        handleClose();
    };

    const handleGuestOrder = () => {
        handleClose();
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Login</DialogTitle>
            <IconButton style={{ position: 'absolute', right: '3px', top: '3px' }} onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ pl: 2, pr: 2, pt: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="country-code-label">Country Code</InputLabel>
                            <StyledSelect
                                labelId="country-code-label"
                                id="country-code"
                                label="Country Code"
                                value={contryCode}
                                onChange={handleCountryCodeChange}
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <FlagIcon />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value={'+92'}>+92</MenuItem>
                            </StyledSelect>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <InputMask
                            mask="9 9 9 - 9 9 9 9 9 9 9"
                            onChange={handlePhoneNumberChange}
                        >
                            {() =>
                                <StyledTextField
                                    variant='outlined'
                                    required
                                    fullWidth
                                    name='phoneNumber'
                                    label='Phone Number'
                                    id='phoneNumber'
                                    error={!!errorPhoneNumber}
                                    helperText={errorPhoneNumber}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <PhoneAndroidOutlinedIcon />
                                            </InputAdornment >
                                        ),
                                    }}
                                />
                            }
                        </InputMask>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleLogin} color="primary" variant="contained" fullWidth>
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box my={2} display="flex" alignItems="center">
                            <Box flexGrow={1} borderBottom={1} borderColor="divider" />
                            <Typography variant="body1" align="center" sx={{ mx: 2 }}>OR</Typography>
                            <Box flexGrow={1} borderBottom={1} borderColor="divider" />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleGuestOrder} color="secondary" variant="outlined" fullWidth>
                            Order as Guest
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            {errorCountryCode && <AlertComponent message={errorCountryCode} type="error" />}
        </Dialog >
    );
};

export default LoginPopup;