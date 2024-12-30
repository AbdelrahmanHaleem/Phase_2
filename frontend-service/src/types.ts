export type LanguageDirection = 'en2ar' | 'ar2en';

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
}

export interface DocumentUploadResponse {
  id: string;
  originalFileName: string;
  translatedFileName: string;
  downloadUrl: string;
  status: 'processing' | 'completed' | 'error';
  error?: string;
}

export interface SummaryResponse {
  summary: string;
  language: string;
  originalLength: number;
  summaryLength: number;
}
