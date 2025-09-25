
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import GeneratorPage from './pages/GeneratorPage';
import ViewerPage from './pages/ViewerPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<GeneratorPage />} />
        <Route path="/view/:config" element={<ViewerPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
