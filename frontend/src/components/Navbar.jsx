import { Container, Flex, HStack, Button, Text, useColorMode } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusSquareIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  
  const { colorMode, toggleColorMode } = useColorMode();
  const currentNav = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleHomeNavigation = () => {
    if (currentNav.pathname === '/create') {
      navigate('/home');
    }
  }

  const handleLogout = async () => {
    await logout();
  }

  return <Container maxW={"1140px"} px={4} >
    <Flex
      h={16}
      alignItems={"center"}
      justifyContent={"space-between"}
      flexDir={{
        base: "column",
        sm: "row",
      }}
    >
      <Text
        cursor="pointer"
        fontSize={{ base: "22", sm: "28" }}
        fontWeight={"bold"}
        textTransform={"uppercase"}
        textAlign={"center"}
        bgGradient={"linear(to-r, cyan.400, blue.500)"}
        bgClip={"text"}
        onClick={handleHomeNavigation}
      >
        Product Store 🛒
      </Text>

      <HStack spacing={2} alignItems={"center"}>
        {currentUser && (
          <>
          <Link to={"/create"}>CreatePage
            <Button>
                <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>
          <Link to={"/login"}>Sign Out

          <Button onClick={handleLogout}>
          <ArrowBackIcon fontSize={20} />
          </Button>
          </Link>
          </>
        )}

        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <IoMoon /> : <LuSun size={20}/>}
        </Button>
      </HStack>
    </Flex>
  </Container>
};
export default Navbar;
