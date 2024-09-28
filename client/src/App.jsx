import { Outlet } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Connectify</title>
      </Helmet>
      <div>
        <Outlet />
      </div>
    </HelmetProvider>
  )
}

export default App
