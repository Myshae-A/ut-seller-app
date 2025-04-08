import { Flex, Icon, IconButton, InputGroup, InputLeftElement, Input, Image, Box, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { AddIcon } from '@chakra-ui/icons';
import logo from "../images/miso_logo.png";
import { FiSearch } from 'react-icons/fi';
import React from 'react';

const Navbar = () => {
  
  const navigate = useNavigate();
  //const { logout, currentUser } = useAuth();

  const handleHomeNavigation = () => {
    navigate('/home');
  }

  const handleAccountNavigation = () => {
    navigate('/account');
  }

  // const handleLogout = async () => {
  //   await logout();
  // }

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
        <IconButton
          aria-label="Add new listing"
          icon={<AddIcon />}
          bgColor="#DD8533"
          color="white"
          borderRadius="full"
          mr="2"
          onClick={handleCreateNavigation}
        />

        {/* account button */}
        <IconButton
          top="6%"
          right="0"
          px={8}
          borderLeftRadius="50"
          borderRightRadius="none"
          aria-label="User profile"
          mr={2}
          size="lg"
          zIndex="1000"
          icon={<Icon as={FiUser} boxSize={6} color="white" />}
          bgColor="#DD8533"
          color="white"
          borderRadius="full"
          onClick={handleAccountNavigation}
        />
      </Flex>
    </Flex>
  </Box>
);
};
export default Navbar;
