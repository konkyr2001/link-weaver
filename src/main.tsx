import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider 
    clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID}
    locale="en"
    >
    <Analytics />
    <SpeedInsights />
    <App />
  </GoogleOAuthProvider>,
);
 