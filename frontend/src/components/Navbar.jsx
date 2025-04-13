import { Tooltip, Button, Flex, Icon, IconButton, InputGroup, InputLeftElement, Input, Image, Box, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { AddIcon, UnlockIcon } from '@chakra-ui/icons';
import logo from "../images/miso_logo.png";
import { FiSearch } from 'react-icons/fi';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleHomeNavigation = () => {
    navigate('/home');
  }

  const handleAccountNavigation = () => {
    navigate('/account');
  }

  // const handleLogout = async () => {
  //   await logout();
  // }

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreateNavigation = () => {
    navigate('/create');
}

return (
<Box py="4" px="6" bg="white" boxShadow="sm">
<Flex width="100%" align="center">
    <Box w="8%" />

    <Flex w="82%" align="center" gap={8}>
      <Flex align="left" gap={1}>
        {/* MISO LOGO */}
        <Heading
          paddingLeft={"5%"}
          fontWeight="normal"
          size="2xl"
          fontFamily="NanumMyeongjo"
          onClick={handleHomeNavigation}
          cursor="pointer" 
        >
          MISO
        </Heading>

        {/*icon */}
        <Image
            src={logo}
            alt="MISO Logo"
            boxSize="40px"
            //mt="1px"
            objectFit="contain"
          />
        </Flex>

        {/* Search bar */}
        <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.600" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              borderRadius="30"
              borderColor="#DD933340"
              focusBorderColor="#DD8533"
              bgColor="#DD933340"
            />
          </InputGroup>
        </Flex>


        <Flex w="10%" justify="flex-end" align="center" pr={6}>


        {/* create item button */}
        <Tooltip label="Create a post!" aria-label="Logout tooltip">
          <IconButton
            aria-label="Add new listing"
            icon={<AddIcon />}
            bgColor="#DD8533"
            color="white"
            borderRadius="full"
            size="md"
            mr="2"
            onClick={handleCreateNavigation}
          />
        </Tooltip>

        {/* account button */}
        <Tooltip label="Open account page" aria-label="Logout tooltip">
          <Button
            top="6%"
            right="0"
            px={4}
            borderLeftRadius="50"
            borderRightRadius="none"
            aria-label="User profile"
            mr={2}
            size="md"
            zIndex="1000"
            bgColor="#DD8533"
            color="white"
            borderRadius="full"
            onClick={handleAccountNavigation}
          >
            <Icon as={FiUser} boxSize={6} color="white" />
          </Button>
        </Tooltip>

        {/* Logout Button */}
        <Tooltip label="Log out" aria-label="Logout tooltip">
          <Button
            bgColor="#DD8533"
            color="white"
            fontWeight={"light"}
            borderRadius={25}
            px={4}
            size="md"
            onClick={handleLogout}
            fontSize={20}
            _hover={{ bgColor: "rgba(221, 147, 51, 0.4)" }}
          >
            <Icon as={UnlockIcon} boxSize={6} color="white"/>
          </Button>
        </Tooltip>
        
      </Flex>
    </Flex>
  </Box>
);
};
export default Navbar;
