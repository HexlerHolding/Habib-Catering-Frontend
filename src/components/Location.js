import React, { useState } from 'react';
import { Dialog, DialogContent, Grid, Button, Box, Select, MenuItem, IconButton, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../reduxes/LocationSlice';

const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
        "&& fieldset": {
            borderColor: theme.palette.primary.main,
        }
    }
}));

const LocationPopup = ({ open, handleClose }) => {
    const c = useSelector((state) => state.location?.city);
    const b = useSelector((state) => state.location?.branch);
    const [city, setCity] = useState(c || '');
    const [branch, setBranch] = useState(b || '');

    const handleCityChange = (event) => setCity(event.target.value);
    const handleBranchChange = (event) => setBranch(event.target.value);

    const dispatch = useDispatch();

    const handleSelect = () => {
        dispatch(setLocation({ city, branch }));
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle style={{ textAlign: 'center' }}>Please Select Your Location</DialogTitle>
            <IconButton style={{ position: 'absolute', right: '3px', top: '3px' }} onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ pl: 2, pr: 2, pt: 0 }}>
                <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex' }}>
                    <Typography variant="h6" component="h6" gutterBottom>Your Brand</Typography>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="p" gutterBottom>Choose City</Typography>
                        <StyledSelect
                            value={city}
                            onChange={handleCityChange}
                            fullWidth
                        >
                            <MenuItem value="City1">City1</MenuItem>
                            <MenuItem value="City2">City2</MenuItem>
                        </StyledSelect>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="p" gutterBottom>Choose Branch</Typography>
                        <StyledSelect
                            value={branch}
                            onChange={handleBranchChange}
                            fullWidth
                        >
                            <MenuItem value="Branch1">Branch1</MenuItem>
                            <MenuItem value="Branch2">Branch2</MenuItem>
                        </StyledSelect>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleSelect} color="primary" variant="contained" fullWidth>
                            Select
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default LocationPopup;