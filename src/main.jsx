import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { APIProvider } from '@vis.gl/react-google-maps'
import "leaflet/dist/leaflet.css";
import { GOOGLE_MAPS_API_KEY } from "./config/maps";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} disableUsageAttribution>
      <App />
    </APIProvider>
  </StrictMode>,
)
