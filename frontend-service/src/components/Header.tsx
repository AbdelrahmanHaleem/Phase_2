import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from '@mui/material';
import { LanguageDirection } from '../types';

interface HeaderProps {
  direction: LanguageDirection;
  onDirectionChange: (direction: LanguageDirection) => void;
}

const Header: React.FC<HeaderProps> = ({ direction, onDirectionChange }) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newDirection: LanguageDirection,
  ) => {
    if (newDirection !== null) {
      onDirectionChange(newDirection);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Translation & Summarization Platform
        </Typography>
        <Box>
          <ToggleButtonGroup
            color="standard"
            value={direction}
            exclusive
            onChange={handleChange}
            aria-label="translation direction"
            sx={{
              backgroundColor: 'white',
              '& .MuiToggleButton-root.Mui-selected': {
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              },
            }}
          >
            <ToggleButton value="en2ar">English → Arabic</ToggleButton>
            <ToggleButton value="ar2en">Arabic → English</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
