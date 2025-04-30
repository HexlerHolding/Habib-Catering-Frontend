import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, TextareaAutosize, Container, useTheme, Card, CardContent, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import PayCart from '../components/PayCart';
import AddressDialog from '../components/Address';

import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';

import { styled } from '@mui/material/styles';
import InputMask from 'react-input-mask';

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.background.paper,
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputAdornment-root.MuiInputAdornment-positionStart': {
        marginTop: '0.7rem',
        marginBottom: 'auto',
    },
}));

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

const Payment = () => {

    const [contryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const top = 64;
    const theme = useTheme();

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleAddressChange = (address) => {
        setAddress(address);
    }

    const formatPhoneNumber = () => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const number = contryCode + cleaned;
        return number;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: top / 8 + 2, padding: theme.spacing(3), backgroundColor: theme.palette.background.paper, borderRadius: theme.shape.borderRadius }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ backgroundColor: theme.palette.background.default, borderRadius: theme.shape.borderRadius }}>
                        <CardContent>
                            <StyledTextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='name'
                                label='Full Name'
                                name='name'
                                value={name}
                                onChange={handleNameChange}
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountCircleOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container justifyContent={'space-between'}>
                                <Grid item xs={9} sm={9} md={3}>
                                    <FormControl variant="outlined" margin='normal' required fullWidth>
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
                                <Grid item xs={12} sm={12} md={8.9}>
                                    <InputMask
                                        mask="9 9 9 - 9 9 9 9 9 9 9"
                                        onChange={handlePhoneNumberChange}
                                    >
                                        {() =>
                                            <StyledTextField
                                                variant='outlined'
                                                margin='normal'
                                                required
                                                fullWidth
                                                name='phoneNumber'
                                                label='Phone Number'
                                                id='phoneNumber'
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
                            </Grid>
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOpen}>Add/Change Address</Button>
                            { open && <AddressDialog open={open} handleClose={handleClose} handleAddressChange={handleAddressChange} /> }
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{address}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ mt: 2, backgroundColor: theme.palette.background.default, borderRadius: theme.shape.borderRadius }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Additional Comments</Typography>
                                    <CustomTextField
                                        name="comment"
                                        onChange={handleDescriptionChange}
                                        value={description}
                                        label="Comment"
                                        fullWidth
                                        multiline
                                        margin='normal'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <InsertDriveFile />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{ mt: 2, backgroundColor: theme.palette.background.default, borderRadius: theme.shape.borderRadius }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Payment Method</Typography>
                                    <Button variant="contained"
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            borderColor: theme.palette.primary.main,
                                            borderWidth: 2,
                                            borderStyle: 'solid',
                                            borderRadius: theme.shape.borderRadius,
                                            boxShadow: 'none',
                                            ":hover": {
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: 'none',
                                                transform: 'none',
                                            },
                                            ":active": {
                                                boxShadow: 'none',
                                                transform: 'none',
                                            }
                                        }}
                                        startIcon={<LocalAtmIcon />}
                                        disableRipple
                                    >
                                        Cash on Delivery
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <PayCart phoneNumber = {formatPhoneNumber()} name = {name} address = {address} description = {description} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Payment;