import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/app-providers';
import { AuthProvider } from './context/auth-context';
import { AppRoutes } from './routes/app-routes';

export function App() {
  return (
    <AppProviders>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppProviders>
  );
}

export default App;
