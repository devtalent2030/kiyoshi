import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ef5350',  // Sushi-red
    },
    secondary: {
      main: '#26a69a', // Wasabi-green
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

export default theme;
