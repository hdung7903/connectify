import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRoute>
      <App />
    </AppRoute>
  </BrowserRouter>
)
