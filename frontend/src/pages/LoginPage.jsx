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
            <Box width="50%">
                <Box mb={8}>
                    <Text
                        fontSize={"50"}
                        fontFamily={'NanumMyeongjo'}
                        bgColor={'black'}
                        bgClip={"text"}
                        textAlign={"center"}
                        mb={0}
                        lineHeight={2}
                    >
                        MISO
                    </Text>
                    <Text
                        fontSize={"20"}
                        bgColor={'black'}
                        bgClip={"text"}
                        textAlign={"center"}
                        mt={0}
                    >
                        Log In
                    </Text>
                </Box>

                <VStack spacing={6}>
                    <FormControl isRequired>
                        <Input 
                            bg="rgb(221, 147, 51, .33)"
                            fontSize={18}
                            fontColor="black"
                            borderRadius={10}
                            padding={5}
                            placeholder='Email'
                            type='email'
                            onChange={(e) => setLoginEmail(e.target.value)}/>
                        <FormHelperText fontSize={12}>Must end with @utexas.edu domain.</FormHelperText>
                    </FormControl>

                    <FormControl isRequired>
                        <Input
                            bg="rgb(221, 147, 51, .33)"
                            fontSize={18}
                            fontColor="black"
                            borderRadius={10}
                            padding={5}
                            placeholder='Password'
                            type='password'
                            onChange={(e) => setLoginPassword(e.target.value)}/>
                        <FormHelperText fontSize={12}>Must be at least 6 characters.</FormHelperText>
                    </FormControl>

                    <Button
                        bgColor={"rgb(221, 147, 51)"}
                        fontSize={18}
                        fontColor="black"
                        borderRadius={20}
                        padding={5}
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
                        Don't have an account? Sign up!
                    </Text>
                </VStack>
            </Box>
        </Container>
    )
}

export default LoginPage;