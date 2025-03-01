import { Button, Container, FormControl, HStack, VStack, Text, Input, FormLabel, FormHelperText, Box, useColorModeValue  } from '@chakra-ui/react';

const SignUpPage = () => {
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
                        <FormLabel>First name</FormLabel>
                        <Input placeholder='Enter First Name' />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input placeholder='Enter Email Address' type='email' />
                        <FormHelperText>Must end with @utexas.edu domain.</FormHelperText>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input placeholder='Enter Password' type='email' />
                        <FormHelperText>Must be at least 6 characters.</FormHelperText>
                    </FormControl>

                    <Button colorScheme='blue' textAlign={"center"} w="full">Register</Button>
                    <Text as='u'>Already have an account?</Text>
                    <Button colorScheme='blue' textAlign={"center"} w="full">Login</Button>
                    
                </VStack>
            </Box>
        </Container>
    )
}

export default SignUpPage;