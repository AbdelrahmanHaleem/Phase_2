import React, { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { LanguageDirection, DocumentUploadResponse } from '../types';

interface DocumentUploadProps {
  direction: LanguageDirection;
}

interface UploadedFile extends DocumentUploadResponse {
  originalFile: File;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ direction }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setError(null);

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post<DocumentUploadResponse>(
            `http://localhost:8000/api/${direction}/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          setFiles((prev) => [
            ...prev,
            { ...response.data, originalFile: file },
          ]);
        } catch (err) {
          setError('File upload failed. Please try again.');
          console.error('Upload error:', err);
        }
      }

      setUploading(false);
    },
    [direction]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
    },
  });

  const handleDownload = async (file: UploadedFile) => {
    try {
      const response = await axios.get(file.downloadUrl, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.translatedFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Download failed. Please try again.');
      console.error('Download error:', err);
    }
  };

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Document Translation
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supported formats: .txt, .docx, .pdf
        </Typography>
      </Box>

      {uploading && <LinearProgress sx={{ mt: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={file.originalFileName}
                secondary={file.status}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="download"
                  onClick={() => handleDownload(file)}
                  disabled={file.status !== 'completed'}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(file.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DocumentUpload;
