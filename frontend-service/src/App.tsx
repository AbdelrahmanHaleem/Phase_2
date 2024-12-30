import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import TranslationPanel from './components/TranslationPanel';
import DocumentUpload from './components/DocumentUpload';
import Header from './components/Header';
import { LanguageDirection } from './types';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [direction, setDirection] = useState<LanguageDirection>('en2ar');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      }),
    [prefersDarkMode],
  );

  const handleDirectionChange = useCallback((newDirection: LanguageDirection) => {
    setDirection(newDirection);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Header direction={direction} onDirectionChange={handleDirectionChange} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <TranslationPanel direction={direction} />
          </Paper>
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <DocumentUpload direction={direction} />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
