import React, { useState, useEffect, useMemo } from 'react';
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
import {
  fetchProducts,
  fetchProductById,
  fetchUserProducts,
  getUserNameFromID,
  updateBookSoldByToOther,
} from '../services/api'; // 
import { uploadProfileImage } from "../services/uploadProfileImage";
import { updateUserProfile } from "../services/api";
import { set } from 'mongoose';

// individual book cards 
//need to change modal to be differnt from home page modal. !!!
const BookCard = ({ book, onToggleFavorite, postedNotifications,
  handleSellingTo, handleFinalizeSell, selectedUserId, setSelectedUserId  }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  // const userRequestedNames = useMemo(() => {
  //   return book.usersRequested.map((id) => ({
  //     id,
  //     name: getUserNameFromID(id) || "blank",
  //   }));
  // }, [book.usersRequested]);

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
        position="relative"
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

          {/* Overlay for Sold Products */}
          {book.status === "sold" && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)" // Transparent gray background
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius={15}
              zIndex={1} // Ensure it appears above the image
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="orange.400"
                textAlign="center"
              >
                SOLD
              </Text>
            </Box>
          )}

          {/* Overlay for Sold Products */}
          {book.status === "bought" && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)" // Transparent gray background
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius={15}
              zIndex={1} // Ensure it appears above the image
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="green.400"
                textAlign="center"
              >
                BOUGHT
              </Text>
            </Box>
          )}

          {/* Red Dot for Notifications */}
          {postedNotifications !== undefined &&  // Check if postedNotifications is defined
          postedNotifications[book.id] && (
            <Box
              position="absolute"
              top="4px"
              right="4px"
              bg="red.500"
              color="white"
              borderRadius="full"
              width="28px"
              height="28px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="bold"
              border="2px solid black"
            >
              {postedNotifications[book.id]} {/* Display the count */}
            </Box>
          )}

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
                
                  {/* Displays Book Status*/}
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    bg="gray.300"
                    borderRadius={30}
                    p={2}
                    textAlign="center"
                  >
                    {book.status ? book.status.charAt(0).toUpperCase() + book.status.slice(1) : "No Status"}
                  </Text>

                  {/* Confirm Sell Button */}
                  {book.status === 'posted' && book.usersRequested && book.usersRequested.length > 0 && (
                    <Box mt={4}>
                      <Text fontWeight="bold" fontSize="sm" mb={2}>
                        Confirm Sell?
                      </Text>
                      <Select
                        placeholder="Select a user"
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        bg="gray.100"
                        borderRadius={10}
                        mb={2}
                      >
                        {book.usersRequested.map((displayName, idx) => (
                          <option key={idx} value={displayName}>
                            {displayName}
                          </option>
                        ))}
                      </Select>
                      <Button
                        size="sm"
                        colorScheme="orange"
                        onClick={() => handleFinalizeSell(book.id, selectedUserId)}
                        isDisabled={!selectedUserId}
                      >
                        Confirm
                      </Button>
                    </Box>
                  )}
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
    const [requestedBooks, setRequestedBooks] = useState([]);
    const [boughtBooks, setBoughtBooks] = useState([]);
    const [soldBooks, setSoldBooks] = useState([]);
    const [postedBooks, setPostedBooks] = useState([]);
    const [savedBooks, setSavedBooks] = useState([]);


    // newer variables
    const [postedNotifications, setPostedNotifications] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(""); // currentUser?.profileImage || 


    const navigate = useNavigate();
    const { currentUser, authBooksRequested } = useAuth();
    const toast = useToast();
    // const [triggerName, setTriggerName] = useState();

    
    // useEffect(() => {
    //   if (currentUser) {
    //     console.log("Current User updated:", currentUser.displayName);
    //     setTriggerName(currentUser.displayName); // Increment trigger to force re-render
    //   }
      
    // }, [currentUser]);


    // const boughtBooks = books.filter(book => book.status === 'bought');
    // const soldBooks = books.filter(book => book.status === 'sold');
    // const postedBooks = books.filter(book => book.status === 'posted');
    // const requestedBooks = books.filter(book => book.status === 'requested');
    // const requestedBooks = [];
    // const savedBooks = books.filter(book => book.status === 'saved');

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

          const data = await fetchUserProducts(currentUser.uid); // Adjust the URL as needed
          
          const list = [];
          for (let i = 0; i < data.length; i++) {
            list.push(data[i]); // Add each requested book to the array
          }
          setBooks(list); // Set the fetched books to state

          const requestList = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'requested') {
              requestList.push(data[i]);
            }
          }
          setRequestedBooks(requestList);

          const postedList = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'posted') {
              postedList.push(data[i]);
            }
          }
          setPostedBooks(postedList);

          const boughtList = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'bought') {
              boughtList.push(data[i]);
            }
          }
          setBoughtBooks(boughtList);

          const soldList = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'sold') {
              soldList.push(data[i]);
            }
          }
          setSoldBooks(soldList);

          const savedList = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'saved') {
              savedList.push(data[i]);
            }
          }
          setSavedBooks(savedList);

        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };
      fetchBooks();
      

    }, []);

    
  //   const generateRequestedBooks = async () => {
  //     // onClick={() => generateRequestedBooks()}
  //     const list = [];
  //     console.log("authBooksRequested: ", authBooksRequested);
  //     console.log("requestedBooks: ", requestedBooks);
  //     for (let i = 0; i < authBooksRequested.length; i++) {
  //       try {
  //         console.log("authBooksRequested[i].id: ", authBooksRequested[i].id);
  //         const book = await fetchProductById(authBooksRequested[i].id); // Fetch each book by ID
  //         list.push(book);
  //         console.log("GENERATE REQUEST BOOKS: ", book);
  //       } catch (error) {
  //         console.error('Error fetching requested book:', error);
  //       }
  //     }
  // }

    useEffect(() => {
      if (postedBooks.length > 0) {
        checkPostedNotifications(); // Run only when postedBooks is updated
      }
    }, [postedBooks]);

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

  //   useEffect(() => { // ensures the products still load after
  //     const loadBooks = async () => {
  //         try {
  //             // Check if products are already saved in localStorage
  //             const savedBooks = localStorage.getItem('books');
  //             if (savedBooks) {
  //                 setBooks(JSON.parse(savedBooks)); // Load books from localStorage
  //                 return;
  //             }

  //             // Fetch products from the backend
  //             if (!currentUser) {
  //                 console.error("User is not defined");
  //                 return;
  //             }

  //             const data = await fetchProducts();
  //             const userBooks = data.filter((product) => product.userPosted === currentUser.uid);
  //             setBooks(userBooks);

  //             // Save fetched books to localStorage
  //             localStorage.setItem('books', JSON.stringify(userBooks));
  //         } catch (error) {
  //             console.error('Error fetching books:', error);
  //         }
  //     };

  //     loadBooks();
  // }, [currentUser]);
  

    const checkPostedNotifications = async () => {
      const postedNotificationsList = {};

      postedBooks.forEach((book) => {
        if (book.usersRequested && book.usersRequested.length > 0) {
          postedNotificationsList[book.id] = book.usersRequested.length; // Store the count of requests for each book
        }
      });

      console.log("FORMAT for postedNoficiationsList: ", postedNotificationsList);
      setPostedNotifications(postedNotificationsList);
      console.log("books posted w notifications: "+postedNotificationsList.length)
    };


    const sellingTo = async (bookId, userId) => {
      console.log("Selling to user ID: ", userId);
      console.log("Selling book ID: ", bookId);
      
    }

    const finalizeSell = async (bookId, userId) => {
      try {
        // Log the selected book and user
        console.log(`Confirming sale for Book ID: ${bookId}, User ID: ${userId}`);
        
        // setBoughtBooks((prevBoughtBooks) => {
        const bookToAdd = books.find((book) => book.id === bookId);
        setSoldBooks((prevSoldBooks) => [
          ...prevSoldBooks,
          { ...bookToAdd, status: "sold", soldTo: userId }, // Update status and add soldTo field
        ]);

        // console.log("Sold By This user: ", currentUser.uid);
        // console.log("Book being sold: ", bookId);
        // console.log("User being sold to: ", userId);

        // does all the work in the backend!!! VERY IMPORTANT!!!
        await updateBookSoldByToOther(currentUser.uid, bookId, userId);

        // currently doing these in frontend, but need to do it in BACKEND TOO!
        // Update the book's status in the state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId
              ? { ...book, status: "sold", soldTo: userId } // Update status and add soldTo field
              : book
          )
        );
    
        setPostedBooks((prevPostedBooks) =>
          prevPostedBooks.filter((book) => book.id !== bookId) // Remove the book from postedBooks
        );

        console.log("Sale confirmed successfully!");
      } catch (error) {
        console.error("Error confirming sale:", error);
      }
    };


    // // Function to handle logout
    // const handleLogout = async () => {
    //   try {
    //     await logout(); // Call the logout function
    //     navigate('/login'); // Redirect to the login page
    //   } catch (error) {
    //     console.error('Error logging out:', error);
    //   }
    // };
  
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
                            <Text fontSize="xl">{currentUser?.displayName || (currentUser?.email ? currentUser.email.split("@")[0] : "User")}</Text>
                            <Text color="gray.600" fontSize="md">{currentUser?.email || "No email available"}</Text>
                        </Box>
                        
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
                            <BookCard 
                              key={book.id}
                              book={book}
                              onToggleFavorite={handleToggleFavorite}
                              postedNotifications={postedNotifications}
                              handleSellingTo={sellingTo}
                              handleFinalizeSell={finalizeSell}
                              selectedUserId={selectedUserId}
                              setSelectedUserId={setSelectedUserId}
                            />
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
                              <BookCard 
                                key={book.id}
                                book={book}
                                onToggleFavorite={handleToggleFavorite}
                                postedNotifications={postedNotifications}
                                handleSellingTo={sellingTo}
                                handleFinalizeSell={finalizeSell}
                                selectedUserId={selectedUserId}
                                setSelectedUserId={setSelectedUserId}
                              />
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
                                <BookCard 
                                  key={book.id}
                                  book={book}
                                  onToggleFavorite={handleToggleFavorite}
                                  postedNotifications={postedNotifications}
                                  handleSellingTo={sellingTo}
                                  handleFinalizeSell={finalizeSell}
                                  selectedUserId={selectedUserId}
                                  setSelectedUserId={setSelectedUserId}
                                />
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
                                <BookCard
                                  key={book.id}
                                  book={book}
                                  onToggleFavorite={handleToggleFavorite}
                                  postedNotifications={postedNotifications}
                                  handleSellingTo={sellingTo}
                                  handleFinalizeSell={finalizeSell}
                                  selectedUserId={selectedUserId}
                                  setSelectedUserId={setSelectedUserId}
                                />
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
                              <BookCard 
                                key={book.id}
                                book={book}
                                onToggleFavorite={handleToggleFavorite}
                                postedNotifications={postedNotifications}
                                handleSellingTo={sellingTo}
                                handleFinalizeSell={finalizeSell}
                                selectedUserId={selectedUserId}
                                setSelectedUserId={setSelectedUserId}
                              />
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
                              <BookCard 
                                key={book.id}
                                book={book}
                                onToggleFavorite={handleToggleFavorite}
                                postedNotifications={postedNotifications}
                                handleSellingTo={sellingTo}
                                handleFinalizeSell={finalizeSell}
                                selectedUserId={selectedUserId}
                                setSelectedUserId={setSelectedUserId}
                              />
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