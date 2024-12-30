// File: /src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TranslatePage from './pages/TranslatePage';
import SummarizePage from './pages/SummarizePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/translate" element={<TranslatePage />} />
        <Route path="/summarize" element={<SummarizePage />} />
      </Routes>
    </Router>
  );
};

export default App;
