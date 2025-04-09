import React, { useState, useEffect } from 'react';
// import american from '../images/american.jpg';
// import linear from '../images/linear.jpg';
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Box,
  Container,
  Flex,
  Text,
  Image,
  Input,
  Icon,
  Avatar,
  IconButton,
  Button,
  Link,
  Tabs,
  Select,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Badge,
  Modal, 
  Divider,
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AddIcon, StarIcon } from '@chakra-ui/icons';
import { fetchProducts } from '../services/api';
import { uploadProfileImage } from "../services/uploadProfileImage";
import { updateUserProfile } from "../services/api";

// individual book cards 
//need to change modal to be differnt from home page modal. !!!
const BookCard = ({ book, onToggleFavorite }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box 
        overflow="hidden"
        display="flex" 
        p={4}
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        cursor="pointer"
        onClick={onOpen}
      >
        <Box 
          width="100%" 
          position="relative" 
          aspectRatio={1} 
          overflow="hidden" 
        >
          <Image 
            borderRadius={15}
            src={book.image}
            alt={book.name}
            objectFit="cover"
            width="full"
            height="full"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book.id);
            }}
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={book.favorite ? '#cc1833' : 'none'}
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </Box>
        
        <Box p={3} position="relative">
          <Text 
            fontWeight="bold" 
            fontSize="sm" 
            noOfLines={1} 
            mb={2}
          >
            {book.name}
          </Text>
          
          <Flex gap={2} mb={2} flexWrap="wrap">
            {book.categories && book.categories.map((cat, idx) => (
              <Badge 
                key={idx} 
                bgColor="rgba(221, 147, 51, 0.47)"
                borderRadius={30}
                p={1}
                px={2}
                fontSize="x-small"
                fontWeight="semibold"
              >
                {cat}
              </Badge>
            ))}
            
            {book.condition && (
              <Badge 
                bgColor="rgba(221, 147, 51, 0.47)"
                borderRadius={30}
                p={1}
                px={2}
                fontSize="x-small"
                fontWeight="semibold"
              >
                {book.condition}
              </Badge>
            )}
          </Flex>
          
          <Text 
            fontWeight="bold" 
            fontSize="sm" 
            color="gray.700"
          >
            ${book.price}
          </Text>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" >
        <ModalOverlay />
        <ModalContent 
          borderRadius={15} 
          border="2px solid"
          borderColor="gray.600"
          bgColor="rgb(226, 225, 225)"
          p={5}
        >
          <Flex direction={{ base: 'row' }} p={5}>
            <Box 
              w={{ base: '40%'}} 
              borderRadius="md"
              pb={4}
              position="relative"
            >
              <Image 
                  src={book.image}
                  alt={book.name}
                  objectFit="cover"
                  width="200px"
                  height="300px"
                  borderRadius="10px"
                  mr={4}
                />
            </Box>

            <Divider 
              orientation="vertical" 
              borderColor="gray.600" 
              border="1px solid"
              height="auto" 
              alignSelf="stretch" 
            />
            <Box
              w={{ base: '60%'}} 
            >
            <ModalCloseButton />
            <ModalBody>
              <Flex
                flexDirection="column"
                //justifyContent="space-between"
                h="100%">
              <Text fontSize="xl" mb={2}>{book.name}</Text>
                
              <Text fontWeight="bold" mb={2}>Price: ${book.price}</Text>

                <Box>
                  <Flex gap={2} mb={2} flexWrap="wrap">
                    {book.categories && book.categories.map((cat, idx) => (
                      <Badge 
                        key={idx} 
                        bgColor="rgba(221, 147, 51, 0.47)"
                        borderRadius={30}
                        p={1}
                        px={2}
                        fontSize="x-small"
                        fontWeight="semibold"
                      >
                        {cat}
                      </Badge>
                    ))}
                    {book.condition && (
                      <Badge 
                        bgColor="rgba(221, 147, 51, 0.47)"
                        borderRadius={30}
                        p={1}
                        px={2}
                        fontSize="x-small"
                        fontWeight="semibold"
                      >
                        {book.condition}
                      </Badge>
                    )}
                  </Flex>
                
                {/*NO FUNCTIONALTY*/}
                  <Select 
                    name="status"
                    placeholder="status" 
                    bg={'gray.300'}
                    _hover={{ bg: 'gray.400' }}
                    _focus={{ bg: 'gray.400' }}
                    variant="filled" 
                    borderRadius={30}
                    size="md"
                  >
                    <option value="Fiction">Sold</option>
                    <option value="Non-Fiction">Selling</option>
                    <option value="Reference">On Hold</option>
                  </Select>
                </Box>

                <Box mt={4}>
                  <Flex gap={2} mb={2} align="center" direction="row" justify="space-evenly">
                    <IconButton
                      icon = {<svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="15" 
                        viewBox="0 0 24 24" 
                        fill={book.favorite ? '#cc1833' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(book.id);
                      }}
                      bgColor="rgba(221, 147, 51, 0.47)"
                      borderRadius={20}
                      p={5}
                    ></IconButton>
                    <IconButton
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      }
                      bgColor="rgba(221, 147, 51, 0.47)"
                      borderRadius={20}
                      p={5}
                    />
                   <Button
                      bgColor="rgba(221, 147, 51, 0.47)"
                      borderRadius={20}
                      p={1}
                      px={5}
                      fontSize="sm"
                      fontWeight="semibold"
                    >...</Button>
                  </Flex>
                </Box>
                    
                <Text  mb={2}>{book.catalogue}</Text>
                <Text  mb={2}>{book.description}</Text>

              </Flex>
            </ModalBody>
            </Box>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

const AccountPage = () => { // STOPPED HERE, trying to login login as YOURSELF
    // const [books, setBooks] = useState(sampleBooks);
    const [books, setBooks] = useState([]); // Initialize books state
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const [profileImage, setProfileImage] = useState(currentUser?.profileImage || "");
    const toast = useToast();

    // OHHH the problem is the name specifically has to be "currentUser", not just "user" !!!
    const handleProfileImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        // setIsUploading(true);
  
        // Upload the profile image to Firebase Storage
        const imageUrl = await uploadProfileImage(file, currentUser.uid);
  
        // console.log("Uploaded image URL:", imageUrl);
        // Update the user's profile in Firestore
        await updateUserProfile(currentUser.uid, imageUrl);
  
        // Update the local state
        setProfileImage(imageUrl);
  
        toast({
          title: "Success",
          description: "Profile image updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast({
          title: "Error",
          description: "Failed to update profile image. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    // Fetch books from the backend when the component mounts
    useEffect(() => {

      // console.log("Current user:", currentUser);
      
      const fetchBooks = async () => {
        try {

          if (!currentUser) {
            console.error("User is not defined");
            return;
          }
          // console.log("here fetching books");
          const data = await fetchProducts(); // Adjust the URL as needed
          // const data = await response.json();

          // console.log("here is the data: ", data);
          // console.log("here is the user: ", data[0].userPosted);

          // console.log(currentUser.uid);
          // filter books to include only those that belong to the logged-in user
          const userBooks = data.filter(product => product.userPosted === currentUser.uid); // Assuming each book has a userId field
          setBooks(userBooks); // Set the fetched books to state
          // setBooks(data); // Uncomment this line if you want to fetch all books

        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };
      fetchBooks();
    }, []);

    // Function to toggle favorite status
    const handleToggleFavorite = (bookId) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId
            ? { ...book, favorite: !book.favorite, status: !book.favorite ? 'saved' : 'selling' }
            : book
        )
      );
    };

    useEffect(() => { // ensures the products still load after
      const loadBooks = async () => {
          try {
              // Check if products are already saved in localStorage
              const savedBooks = localStorage.getItem('books');
              if (savedBooks) {
                  setBooks(JSON.parse(savedBooks)); // Load books from localStorage
                  return;
              }

              // Fetch products from the backend
              if (!currentUser) {
                  console.error("User is not defined");
                  return;
              }

              const data = await fetchProducts();
              const userBooks = data.filter((product) => product.userPosted === currentUser.uid);
              setBooks(userBooks);

              // Save fetched books to localStorage
              localStorage.setItem('books', JSON.stringify(userBooks));
          } catch (error) {
              console.error('Error fetching books:', error);
          }
      };

      loadBooks();
  }, [currentUser]);

    // Function to handle logout
    const handleLogout = async () => {
      try {
        await logout(); // Call the logout function
        navigate('/login'); // Redirect to the login page
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  
    const boughtBooks = books.filter(book => book.status === 'bought');
    const soldBooks = books.filter(book => book.status === 'sold');
    const postedBooks = books.filter(book => book.status === 'posted');
    const requestedBooks = books.filter(book => book.status === 'requested');
    const savedBooks = books.filter(book => book.status === 'saved');
  
    return (  
        <Box bg="white">
            <Navbar />
                {/* Profile Section */}
                <Container maxWidth="60%" pt="6" pb="4" >
                    <Flex direction="row" align="center" gap={8} justify="flex-start">
                        <Box>
                          <label htmlFor="profile-image-input" >
                            <Avatar
                            size="2xl"
                            src={profileImage}
                            bg="gray.200"
                            mb="4"
                            cursor="pointer"
                            />
                          </label>

                          <Input
                            id="profile-image-input"
                            type="file"
                            accept="image/*"
                            display="none" // Hides the input
                            onChange={handleProfileImageChange}
                          />
                        </Box>
                    
                        <Box>
                            <Text fontSize="xl">{currentUser?.displayName || "User"}</Text>
                            <Text color="gray.600" fontSize="md">{currentUser?.email || "No email available"}</Text>
                        </Box>

                        {/* Logout Button */}
                        <Button
                          bgColor="#DD8533"
                          color="white"
                          fontWeight={"light"}
                          borderRadius={25}
                          px={10}
                          onClick={handleLogout}
                          _hover={{ bgColor: "rgba(221, 147, 51, 0.4)" }}
                        >
                          Log Out
                        </Button>
                    </Flex>
                </Container>

                {/* Tabs Section */}
                <Box>
                <Container maxW="container.lg" p="0">
                    <Tabs variant="line" colorScheme="orange" isFitted>
                    <TabList>
                        <Tab>All</Tab>
                        <Tab>Bought</Tab>
                        <Tab>Sold</Tab>
                        <Tab>Posted</Tab>
                        <Tab>Requested</Tab>
                        <Tab>Saved</Tab>
                    </TabList>
        
                    <TabPanels>
                        {/* All Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {books.length > 0 ? books.map((book) => (
                            <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No items to display</Text>
                          }
                        </SimpleGrid>
                        </TabPanel>

                        {/* Bought Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {boughtBooks.length > 0 ?
                            boughtBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No bought items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>
        
                        {/* Sold Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {soldBooks.length > 0 ? 
                            soldBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No sold items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>

                        {/* Posted Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {postedBooks.length > 0 ?
                            postedBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No posted items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>

                        {/* Requested Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {requestedBooks.length > 0 ?
                            requestedBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No requested items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>                        
        
                        {/* Saved Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {savedBooks.length > 0 ? 
                            savedBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No saved items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>

                    </TabPanels>
                    </Tabs>
                </Container>
                </Box>
        </Box>
    );
  };
  
  export default AccountPage;