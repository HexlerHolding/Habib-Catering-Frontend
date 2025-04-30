import { createTheme } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material';

let theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(250, 191, 44)',
            light: 'rgb(255, 224, 130)',
            dark: 'rgb(255, 171, 26)',
        },
        secondary: {
            main: 'rgb(212, 0, 0)',
            light: 'rgb(255, 71, 71)',
            dark: 'rgb(157, 0, 0)',
        },
        background: {
            default: '#f0f0f0',
        },
    },
    typography: {
        fontFamily: "'Poppins', 'Roboto', 'Corben', sans-serif",
        fontSize: 10,
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 800,
        button: {
            fontSize: '0.75rem',
            fontWeight: 800,
        },
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    marginTop: '-0.4rem',
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;