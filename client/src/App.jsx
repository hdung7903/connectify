import { Outlet } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function App() {
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
