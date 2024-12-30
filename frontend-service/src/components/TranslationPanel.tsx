import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Button,
  Grid,
} from '@mui/material';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { LanguageDirection, TranslationResponse } from '../types';

interface TranslationPanelProps {
  direction: LanguageDirection;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({ direction }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = async (text: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post<TranslationResponse>(
        `http://localhost:8000/api/${direction}/translate`,
        { text }
      );
      setTranslatedText(response.data.translatedText);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedTranslate = useCallback(
    debounce((text: string) => translateText(text), 500),
    [direction]
  );

  useEffect(() => {
    if (sourceText) {
      debouncedTranslate(sourceText);
    }
    return () => {
      debouncedTranslate.cancel();
    };
  }, [sourceText, debouncedTranslate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Real-time Translation
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label={direction === 'en2ar' ? 'English Text' : 'Arabic Text'}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            dir={direction === 'en2ar' ? 'ltr' : 'rtl'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label={direction === 'en2ar' ? 'Arabic Translation' : 'English Translation'}
            value={translatedText}
            InputProps={{
              readOnly: true,
              endAdornment: isLoading && <CircularProgress size={20} />,
            }}
            dir={direction === 'en2ar' ? 'rtl' : 'ltr'}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={handleCopy}
          disabled={!translatedText}
        >
          Copy Translation
        </Button>
      </Box>
    </Box>
  );
};

export default TranslationPanel;
