import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { AuthProvider } from './contexts/AuthContext'
import * as Sentry from "@sentry/react"
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/ui/Toast/ToastContainer'
import { isDevMode } from './utils/logger'

// Should only work in production.  Reduces number of "errors" sent to Sentry.
if (!isDevMode) {
    Sentry.init({
        dsn: "https://b3386d5a4a301b84469386a7b01be48c@o4509810252906496.ingest.us.sentry.io/4509810256510976",
        // Setting this option to true will send default PII data to Sentry.
        // For example, automatic IP address collection on events
        sendDefaultPii: true
    });
}

const rootElement = document.getElementById('root');
if (!rootElement) { throw new Error('Root element not found'); };
createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <ToastProvider>
                <App />
                <ToastContainer />
            </ToastProvider>
        </AuthProvider>
    </StrictMode>,
)
