import { useToast, Button, Container, FormControl, HStack, VStack, Text, Input, FormLabel, FormHelperText, Box, useColorModeValue  } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase-client';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {

    const navigate = useNavigate();
    const toast = useToast();
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        // TODO: Add Firebase login with email/password functionality here.
        const { success, message } = await login(loginEmail, loginPassword);
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setLoginEmail('');
            setLoginPassword('');
        }
      };

    return (
        <Container maxW='container.sm' py={44} display="flex" justifyContent="center" alignItems="center">
            <Box w={"full"} bg={useColorModeValue("white", "gray.800")}
                    p={6} rounded={"lg"} shadow={"md"}>
                <Text
                    fontSize={"40"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                    textAlign={"center"}
                >
                    Login
                </Text>

                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder='Enter Email Address'
                            type='email'
                            onChange={(e) => setLoginEmail(e.target.value)}/>
                        <FormHelperText>Must end with @utexas.edu domain.</FormHelperText>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder='Enter Password'
                            type='password'
                            onChange={(e) => setLoginPassword(e.target.value)}/>
                        <FormHelperText>Must be at least 6 characters.</FormHelperText>
                    </FormControl>

                    <Button
                        colorScheme='blue'
                        textAlign={"center"}
                        w="full"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                    
                    <Text
                        as='u'
                        cursor='pointer'
                        onClick={() => navigate('/signup')}
                    >
                        No account? Register here!
                    </Text>
                </VStack>
            </Box>
        </Container>
    )
}

export default LoginPage;