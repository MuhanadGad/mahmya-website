import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import Website from './site/Website';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Website />
  </StrictMode>,
);
