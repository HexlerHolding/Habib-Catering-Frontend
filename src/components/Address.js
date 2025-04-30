import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Paper } from '@mui/material';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { InputAdornment } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';

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

const AddressDialog = ({ open, handleClose, handleAddressChange}) => {
    const [currentAddress, setCurrentAddress] = useState('');

    const [markerPosition, setMarkerPosition] = useState({ lat: 40.756795, lng: -73.954298 });

    const handleMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
    };

    const handleCurrentAddressChange = (e) => {
        setCurrentAddress(e.target.value);
    };

    const handleSaveAddress = () => {
        handleAddressChange(currentAddress);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth='md'>
            <DialogTitle>Add/Change Address</DialogTitle>
            <IconButton style={{ position: 'absolute', right: '3px', top: '3px' }} onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent sx = {{ padding: '10px' }}>
                <StyledTextField
                    name="address"
                    label="Address"
                    margin='normal'
                    onChange={handleCurrentAddressChange}
                    value={currentAddress}
                    fullWidth
                    required
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOn />
                            </InputAdornment>
                        ),
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '10px' }}>
                    <Paper elevation={3} style={{ borderRadius: '10px', overflow: 'hidden', width: '100%', aspectRatio: '1', maxHeight: '500px' }}>
                        <LoadScript googleMapsApiKey="AIzaSyAT9ACrG0vNXM5mfnnwyti6xre_Nxlt0FQ">
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={markerPosition}
                                zoom={13}
                            >
                                <Marker
                                    draggable={true}
                                    onDragEnd={handleMarkerDragEnd}
                                    position={markerPosition}
                                />
                            </GoogleMap>
                        </LoadScript>
                    </Paper>
                </div>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={handleSaveAddress} color='primary' variant='contained'>
                    Save Address
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddressDialog;