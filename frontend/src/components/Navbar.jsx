import { Flex, Button, Text, useColorMode, Icon, IconButton, Box, Heading } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { useAuth } from '../contexts/AuthContext';
import { FiUser } from 'react-icons/fi';
import { AddIcon } from '@chakra-ui/icons';

const Navbar = () => {
  
  const { colorMode, toggleColorMode } = useColorMode();
  const currentNav = useLocation();
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
    <Flex justify="space-between" align="center">
      {/* MISO LOGO */}
      <Heading
        paddingLeft="5%"
        fontWeight="normal"
        size="2xl"
        fontFamily="NanumMyeongjo"
        onClick={handleHomeNavigation}
        cursor="pointer" 
      >
        MISO
      </Heading>

      

      <Flex align="center">

        {/* create item button */}
        <IconButton
          aria-label="Add new listing"
          icon={<AddIcon />}
          bgColor="rgb(221, 147, 51)"
          borderRadius="full"
          mr="2"
          onClick={handleCreateNavigation}
        />

        {/* account button */}
        <IconButton
          aria-label="User profile"
          icon={<Icon as={FiUser} boxSize={6} color="gray.800" />}
          bgColor="rgba(221, 147, 51, 0.4)"
          borderRadius="full"
          onClick={handleAccountNavigation}
        />
      </Flex>
    </Flex>
  </Box>
);
};
export default Navbar;
