import { StrictMode, React } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import { Provider } from "@/components/ui/provider"
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
