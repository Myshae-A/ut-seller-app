import { Box, useColorModeValue } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<SignUpPage />} />
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Box>
  )
}

export default App
