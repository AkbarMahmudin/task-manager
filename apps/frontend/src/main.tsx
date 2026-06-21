import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers/app-providers';
import App from './app/App';

import './styles/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

ReactDOM.createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
