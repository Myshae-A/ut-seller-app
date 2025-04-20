import { Tooltip, Button, Flex, Icon, IconButton, InputGroup, InputLeftElement, Input, Image, Box, Heading, Menu,
  MenuButton,
  MenuList,
  MenuItem, } from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AddIcon, UnlockIcon } from '@chakra-ui/icons';
import logo from "../images/miso_logo.png";
import { FiSearch, FiUser, FiLogOut, FiUserCheck } from 'react-icons/fi';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

const Navbar = ({ searchQuery, handleSearchInput, handleSearchKeyDown}) => {
  
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
        <Tooltip label="Go to home page feed" aria-label="Home tooltip">
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
        </Tooltip>

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
        {location.pathname === '/home' && <SearchBar
          searchQuery={searchQuery}
          onSearchInput={handleSearchInput}
          onSearchKeyDown={handleSearchKeyDown}
        />}
        
        </Flex>


        <Flex w="10%" ml="auto" justify-items="right" pr={0}>


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
          {/* <IconButton
            aria-label="Open Account"
            bgColor="#DD8533"
            color="white"
            borderRadius="full"
            size="md"
            mr="2"
            onClick={handleAccountNavigation}
            icon={<FiUser />}
          /> */}
            <Menu>
            <MenuButton
              as={Button}
              bgColor="#DD8533"
              color="white"
              borderRadius="full"
              size="md"
              minW="40px"
              h="40px"
              p={0}
              _hover={{ bgColor: "#d0762c" }}
              _expanded={{ bgColor: "#c56924" }}
              aria-label="Account menu"
            >
              <Icon as={FiUser} boxSize={5} />
            </MenuButton>

            <MenuList
              minW="fit-content">
              <MenuItem icon={<FiUserCheck />} onClick={() => navigate('/account')}>
                Your Profile</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={() => handleLogout()}>
                Log out</MenuItem>
            </MenuList>
          </Menu>
        </Tooltip>
        
      </Flex>
    </Flex>
  </Box>
);
};
export default Navbar;
