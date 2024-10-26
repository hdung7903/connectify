import { Outlet } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Spinning from './components/Spinning';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return <Spinning spinning={true} />;
  }
  return (
    <HelmetProvider>
      <Helmet>
        <title>Connectify</title>
      </Helmet>
      <div style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
    </HelmetProvider>
  )
}

export default App
