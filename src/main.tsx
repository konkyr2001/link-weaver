import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider 
    clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID}
    locale="en"
    >
    <App />
  </GoogleOAuthProvider>,
);
