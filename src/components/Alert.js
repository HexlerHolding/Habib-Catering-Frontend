import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/system';

const StyledAlert = styled(Alert)(({ theme }) => ({
    '& .MuiAlert-message': {
        fontSize: '1.2em',
    },
}));

const AlertComponent = ({ message, type, duration = 2000, position = { vertical: 'bottom', horizontal: 'center' } }) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={position}>
            <StyledAlert severity={type} onClose={handleClose}>
                {message}
            </StyledAlert>
        </Snackbar>
    );
};

export default AlertComponent;