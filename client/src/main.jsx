import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <AppRoute>
          <App />
        </AppRoute>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
)
