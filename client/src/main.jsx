import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoute from "./routes/AppRoute.jsx";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext.jsx";
// import { SocketProvider } from './contexts/SocketContext.jsx';
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import ChatProvider from "./contexts/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          {/* <SocketProvider> */}
          <NotificationProvider>
            <AppRoute>
              <App />
            </AppRoute>
          </NotificationProvider>
          {/* </SocketProvider> */}
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
