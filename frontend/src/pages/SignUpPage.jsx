import React, { useState } from 'react';
import { Button, Container, FormControl, useToast, VStack, Text, Input, FormLabel, FormHelperText, Box, useColorModeValue } from '@chakra-ui/react';
import { auth } from '../firebase-client';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpPage = () => {

    const navigate = useNavigate();

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const toast = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        // TODO: Add Firebase signup with email/password functionality here.
        try {
            if (!registerEmail.endsWith('@utexas.edu')) {
                toast({
                    title: "Error",
                    description: 'Please enter a valid UTexas email address.',
                    status: "error",
                    duration: 3000, // 3 seconds
                    isClosable: true,
                  });
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
                setRegisterEmail('')
                setRegisterPassword('')
                navigate('/home');
                console.log('ACCOUNT CREATED: '+userCredential.user.email)
            }
        } catch (error) {
          console.error("SIGNUP ERROR: ", error.message)
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