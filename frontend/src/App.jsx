import { Box, useColorModeValue } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";


import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  // ensures navBar doesn't appear on login or signup pages
  const location = useLocation();
  const showNavbar = location.pathname === '/home' || location.pathname === '/create';

  return (
    <AuthProvider>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Box>
    </AuthProvider>
  )
}

export default App
