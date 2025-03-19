import React, { useState } from 'react';
import { Button, Container, FormControl, useToast, VStack, Text, Input, FormLabel, FormHelperText, Box } from '@chakra-ui/react'; // useColorModeValue
// import { auth } from '../firebase-client';
import { useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../services/api';

// import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions
// const db = getFirestore();

const SignUpPage = () => {

    const navigate = useNavigate();
    // const { register } = useAuth();
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const toast = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        // TODO: Add Firebase signup with email/password functionality here.
        const { success, message } = await registerUser(registerEmail, registerPassword);
        
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
            navigate('/login');
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
                    Sign Up
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
                            onChange={(e) => setRegisterEmail(e.target.value)}
                        />
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
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
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
                        onClick={handleRegister}
                    >
                        Register
                    </Button>

                    <Text
                        as='u'
                        cursor='pointer'
                        onClick={() => navigate('/login')}
                    >
                        Already have an account? Log in!
                    </Text>
                </VStack>
            </Box>
        </Container>
    )
}

export default SignUpPage;