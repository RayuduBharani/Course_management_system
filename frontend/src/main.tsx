import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Provider } from 'react-redux'
import { store } from './components/store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <GoogleOAuthProvider clientId="106160230732-lneq2ntge0rt74v5da9th7194d6uiq3h.apps.googleusercontent.com">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </Provider>
  // {/* </StrictMode> */}
)