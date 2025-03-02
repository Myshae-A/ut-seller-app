import React, { useState } from 'react';
import { Button, Container, FormControl, useToast, VStack, Text, Input, FormLabel, FormHelperText, Box, useColorModeValue } from '@chakra-ui/react';
// import { auth } from '../firebase-client';
import { useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

// import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions
// const db = getFirestore();

const SignUpPage = () => {

    const navigate = useNavigate();
    const { register } = useAuth();
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const toast = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        // TODO: Add Firebase signup with email/password functionality here.
        const { success, message } = await register(registerEmail, registerPassword);
        
        if (success) {
            setRegisterEmail('');
            setRegisterPassword('');
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
                    Register
                </Text>

                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input 
                            placeholder='Enter Email Address'
                            type='email'
                            onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                        <FormHelperText>Must end with @utexas.edu domain.</FormHelperText>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder='Enter Password'
                            type='password'
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <FormHelperText>Must be at least 6 characters.</FormHelperText>
                    </FormControl>

                    <Button
                        colorScheme='blue'
                        textAlign={"center"}
                        w="full"
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                    <Text
                        as='u'
                        cursor='pointer'
                        onClick={() => navigate('/login')}
                    >
                        Back to login.
                    </Text>
                </VStack>
            </Box>
        </Container>
    )
}

export default SignUpPage;