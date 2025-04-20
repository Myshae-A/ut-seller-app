import { 
  Box, 
  Flex,
  Text, 
  Icon,
  Image, 
  Grid, 
  VStack, 
  HStack, 
  Badge,
  IconButton,
  Button,
  Modal, 
  Divider,
  Menu,
  MenuList,
  MenuButton,
  MenuItem, 
  MenuItemOption,
  MenuOptionGroup,
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  Select,
  useDisclosure,
  useClipboard,
  useToast,
  Input,
  Textarea
} from '@chakra-ui/react';
import { FiFilter, FiFlag } from 'react-icons/fi';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { HiHeart } from "react-icons/hi";
import SideSearchTab from '../components/SideBar';
import {
  fetchProducts,
  fetchProductById,
  addProductToUser,
  updateUsersRequestedGlobally
} from '../services/api';
import { useEffect } from 'react';
import Banner from '../components/Banner';
import { useAuth } from "../contexts/AuthContext";
//import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from '../components/Navbar';
import React from 'react';



const BookCard = ({ book, onToggleFavorite, currentUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgIndex, setImgIndex] = useState(0);
  //const toast = useToast();
  // const { updateBooksRequested } = useAuth(); // Assuming you have a context or state management for this

  const tags = [
    ...(book.subject ? [book.subject] : []),
    ...(book.condition ? [book.condition] : []),
  ];
  
  const maxTotalLength = 23; // Adjust this number to fit your layout
  let totalLength = 0;
  const visibleTags = [];
  const hiddenTags = [];

  tags.forEach((tag) => {
    if (totalLength + tag.length <= maxTotalLength) {
      visibleTags.push(tag);
      totalLength += tag.length;
    } else {
      hiddenTags.push(tag);
    }
  });

  const subjectColors = {
    math: '#F33A3A40',
    english: '#E8C81740',
    science: '#7EC74340',
    'visual and performing arts': '#DD933340',
    'first-year signature course': '#D553AC40',
    government: '#9434E340',
    history: '#50B8F040',
  };

  const [showSharePopup, setShowSharePopup] = useState(false);
  const shareUrl = `https://yourapp.com/listings/${book.id}`; // replace with actual URL
  const { hasCopied, onCopy } = useClipboard(shareUrl);
  const toast = useToast();
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const [showReportOverlay, setShowReportOverlay] = useState(false);
  
  const handleNextImage = () => {
    setImgIndex((prevIndex) => (prevIndex + 1) % book.image.length);
  };

  const handleMakeRequest = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to make a request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {

      if (book.usersRequested.includes(currentUser.uid)) {
        toast({
          title: "Error",
          description: "You have already requested this book.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // console.log("Making request for product ID:", book.id, "by user ID:", currentUser.uid);
      const requestedProduct = await fetchProductById(book.id); // Assuming you have a function to get the product by ID
      const userId = currentUser.uid;
      console.log("[HOMEPAGE] requestedProduct: ", requestedProduct);

      const productData = requestedProduct.product || requestedProduct; // Adjust based on your API response structure
      // console.log("requestedProduct as JSON: ", JSON.stringify(requestedProduct));
      // console.log("requestedProduct.status1: ", requestedProduct.product.status);
      productData.status = "requested";
      productData.usersRequested.push(userId); // Add the user ID to the usersRequested array
      
      console.log("IS THIS WORKING??", productData);
      
      // console.log("requestedProduct.status2: ", requestedProduct.status);
      const formattedProduct = { ...productData};

      const userPostedId = productData.userPosted
      console.log("userPostedID: ", userPostedId);

      // Add the product to the user's userProducts list
      await addProductToUser(userId, formattedProduct);

      await updateUsersRequestedGlobally(userId, book.id, userPostedId); // Assuming you have a function to update the user's requested products

      
      
      // console.log("requested Product here, new testgin"+JSON.stringify(formattedProduct));

      toast({
        title: "Success",
        description: "Request sent successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Error making request:", error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    
  };
  
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
            alt={book.title}
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
        
        <Box p={3} width="100%" textAlign="left">          <Text 
            fontWeight="bold" 
            fontSize="lg" 
            noOfLines={1} 
            mb={2}
          >
            {book.name}
          </Text>
          
          <Flex gap={2} mb={2} flexWrap="wrap">
                      {visibleTags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          bgColor={subjectColors[book.subject.toLowerCase()] || "rgba(221, 147, 51, 0.47)"}
                          borderRadius={30}
                          p={1}
                          px={2}
                          fontSize="x-small"
                          fontWeight="semibold"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {hiddenTags.length > 0 && (
                        <Badge
                          bgColor="gray.300"
                          borderRadius={30}
                          p={1}
                          px={2}
                          fontSize="x-small"
                          fontWeight="semibold"
                        >
                          +{hiddenTags.length}
                        </Badge>
                      )}
                    </Flex>
          
          <Text 
            fontSize="sm" 
            color="black"
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
                  src={book.image} // show current image - got rid of book.image[imgIndex]
                  alt={book.title}
                  objectFit="cover"
                  width="200px"
                  height="300px"
                  borderRadius="10px"
                  mr={4}
                  onClick={handleNextImage} // cycle to next image
                  cursor="pointer"
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
              <Text fontWeight="bold" fontSize="xl" mb={2}>{book.name}</Text>
                
              <Text  mb={2}>Price: ${book.price}</Text>

                <Box>
                  <Flex gap={2} mb={2} flexWrap="wrap">
                    {book.subject && (
                      <Badge 
                        bgColor={subjectColors[book.subject.toLowerCase()] || "rgba(221, 147, 51, 0.47)"}
                        borderRadius={30}
                        p={1}
                        px={2}
                        fontSize="x-small"
                        fontWeight="semibold"
                      >
                        {book.subject}
                      </Badge>
                    )}
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
                </Box>
                <Button
                  bgColor={"rgb(221, 147, 51)"}
                  borderRadius={20}
                  onClick={handleMakeRequest}
                >
                  {/*no link functionality yet*/}
                  <Link style={{ fontWeight:'lighter' }}>
                    Make a Request
                  </Link>
                </Button>

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
                    <Button
                          bgColor="rgba(221, 147, 51, 0.47)"
                          borderRadius={20}
                          p={1}
                          px={5}
                          fontSize="sm"
                          fontWeight="semibold"
                          onClick={() => {
                            onCopy();
                            toast({
                              title: "Link copied!",
                              description: "The listing link has been copied to your clipboard.",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          }}
                        >
                          <Icon
                            as={() => (
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
                            )}
                          />
                        </Button>
                  {showSharePopup && (
                    <Box
                      position="fixed"
                      top="0"
                      left="0"
                      w="100vw"
                      h="100vh"
                      bg="rgba(0, 0, 0, 0.4)"
                      zIndex="2000"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        bg="white"
                        p={6}
                        borderRadius="md"
                        maxW="400px"
                        w="90%"
                        boxShadow="lg"
                      >
                        <Text fontSize="lg" fontWeight="semibold" mb={3}>
                          Share this listing
                        </Text>

                        <VStack spacing={3}>
                          <Input value={shareUrl} isReadOnly bg="gray.100" />
                          <Button
                            size="sm"
                            onClick={() => {
                              onCopy();
                              toast({
                                title: "Link copied!",
                                description: "The listing link has been copied to your clipboard.",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                              });
                            }}
                            colorScheme="blue"
                            w="100%"
                          >
                            Copy Link
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSharePopup(false)}
                          >
                            Cancel
                          </Button>
                        </VStack>
                      </Box>
                    </Box>
                  )}

                   <Button
                      bgColor="rgba(221, 147, 51, 0.47)"
                      borderRadius={20}
                      p={1}
                      px={5}
                      fontSize="sm"
                      fontWeight="semibold"
                      onClick={() => setShowReportOverlay(true)}
                    >
                      <Icon as={FiFlag} />
                    </Button>

                    {showReportOverlay && (
                      <Box
                        position="fixed"
                        top="0"
                        left="0"
                        w="100vw"
                        h="100vh"
                        bg="rgba(0, 0, 0, 0.4)"
                        zIndex="2000"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box
                          bg="white"
                          p={8}
                          borderRadius="md"
                          maxW="500px"
                          w="90%"
                          boxShadow="lg"
                        >
                          <Text fontSize="lg" mb={4}>
                            Why are you reporting this listing?
                          </Text>
                          <VStack spacing={3}>
                            <Select placeholder="Select reason" bgColor="#D9D9D9">
                              <option value="spam" >Spam</option>
                              <option value="inappropriate">Inappropriate content</option>
                              <option value="misleading">Misleading information</option>
                            </Select>
                            <Textarea placeholder="Please Explain" bgColor="#D9D9D9" />
                            <Button
                              bgColor="#DD8533"
                              color="white"
                              w="100%"
                              borderRadius="full"
                              onClick={() => setShowReportOverlay(false)}
                            >
                              Report Listing
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowReportOverlay(false)}
                            >
                              Cancel
                            </Button>
                          </VStack>
                        </Box>
                      </Box>
                    )}

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

const HomePage = () => {

  const { currentUser } = useAuth();
  // Olivia's working code
  const [books, setBooks] = useState([]);
  // const toast = useToast();
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if more products are available
 
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books
  const [gotOriginalBooks, setGotOriginalBooks] = useState(false); // Track if original books are fetched
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // filter states:
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Track selected department
  const [selectedCatalogNumber, setSelectedCatalogNumber] = useState(""); // Track selected catalog number
  

  // Fetch products for the current page
  const fetchMoreProducts = async () => {
    try {
      const limit = 10; // Number of products to fetch per page
      const response = await fetchProducts(page, limit); // Pass page and limit to the API
      if (response.length === 0) {
        setHasMore(false); // No more products to load
        return;
      }
      // Shows products that are NOT this user's in homepage
      const filteredProducts = response.filter(
        (product) =>
          product.userPosted !== currentUser.uid &&
          product.status !== "bought" &&
          product.status !== "sold"
      );
      setBooks(filteredProducts); // Append new products to the list

      // THIS SOLVES OUR "1st filter doesn't work" problem!!!!
      setTimeout(() => {
        setFilteredBooks(filteredProducts); // Initialize filteredBooks
        setGotOriginalBooks(true); // Ensure this runs only once
      }, 500); 
      // console.log("filteredBooks TEST INTRO?: ", filteredBooks);
      // setPage((prevPage) => prevPage + 1); // Increment the page number
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMoreProducts(); // Load the first page of products
    }
    if (books.length > 0 && !gotOriginalBooks) {
      setFilteredBooks(books); // Store the original books
      setGotOriginalBooks(true); // Ensure this runs only once
      console.log("filteredBooks initialized:", books);
    }
  }, [gotOriginalBooks]);

  // Handle search input WORKS NOW!!!!
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);

    if (!gotOriginalBooks) {
      setFilteredBooks(books); // Store the original books before filtering
      setGotOriginalBooks(true); // Set the flag to true after storing original books
    }
  };

  // Handle search on Enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim() === "") {
        // If the search query is empty, reset to show all books
        // console.log("filteredBooks: ", filteredBooks);
        // console.log("books: ", books);
        setBooks(filteredBooks);
      } else {
        // setFilteredBooks(books); // Reset to show all books before filtering
        // Filter books based on the search query
        const filtered = books.filter((book) =>
          book.name?.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setBooks(filtered); // Update the books state with the filtered results
      }
    }
  };

  const handleApplyFilters = () => {

    // if (!filteredBooks || filteredBooks.length === 0) {
    //   console.log("FilteredBooks is not initialized yet.");
    //   return; // Prevent filtering if filteredBooks is not initialized
    // }

    const filters = {
      subjects: selectedSubjects,
      conditions: selectedConditions,
      department: selectedDepartment,
      catalogNumber: selectedCatalogNumber,
    };

    console.log("Wave 1");
    // VERY IMPORTANT, makes sure the orignal books are stored (before filering)
    if (!gotOriginalBooks) {
      setFilteredBooks(books);
      setGotOriginalBooks(true);
    }

    // Check if all filters are empty
    const noFiltersSelected =
    (!filters.subjects || filters.subjects.length === 0) &&
    (!filters.conditions || filters.conditions.length === 0) &&
    !filters.department &&
    !filters.catalogNumber;

    console.log("subjects: ", filters.subjects);
    console.log("conditions: ", filters.conditions);
    console.log("department: ", filters.department);
    console.log("catalogNumber: ", filters.catalogNumber);
    console.log("noFiltersSelected: ", noFiltersSelected);
    console.log("filteredBooks: ", filteredBooks);
    console.log("Wave 2")
    if (noFiltersSelected) {
      // Reset to filteredBooks if no filters are selected
      setBooks(filteredBooks);
      resetFilters();
      return;
    }

    console.log("Wave 3")
    let filtered = [...filteredBooks]
    console.log("filtered: ", filtered);
  
    if (filters.subjects && filters.subjects.length > 0) {
      filtered = filtered.filter((book) => filters.subjects.includes(book.subject));
    }

    if (filters.conditions && filters.conditions.length > 0) {
      filtered = filtered.filter((book) => filters.conditions.includes(book.condition));
    }

    if (filters.department) {
      filtered = filtered.filter((book) =>
        book.department?.toLowerCase() === filters.department.toLowerCase()
      );
    }

    if (filters.catalogNumber) {
      filtered = filtered.filter((book) =>
        book.catalogNumber?.toLowerCase() === filters.catalogNumber.toLowerCase()
      );
    }
  
    setBooks(filtered);
    resetFilters();
  };

  const resetFilters = () => {
    setSelectedSubjects([]); // Reset subjects to an empty array
    setSelectedConditions([]); // Reset conditions to an empty array
    setSelectedDepartment(""); // Reset department to an empty string
    setSelectedCatalogNumber(""); // Reset catalog number to an empty string
  };

  const handleToggleFavorite = (bookId) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId 
          ? { ...book, favorite: !book.favorite } 
          : book
      )
    );
  };

  return (
    <Box bg="white" minHeight="100vh">
    
    <Navbar
      searchQuery={searchQuery}
      handleSearchInput={handleSearchInput}
      handleSearchKeyDown={handleSearchKeyDown}
    />
    <Banner />
    <Flex direction="column" p={4}>
      {/* Filter and Sort Buttons */}
      <Flex gap={3} mb={4} alignItems="right" justifyContent="right">
        <Button
        
          rightIcon={<FiFilter/>}
          onClick={() => setIsSidebarOpen(true)}
          backgroundColor={'rgb(195, 195, 195)'}
        >
          Filters
        </Button>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} backgroundColor={'rgb(195, 195, 195)'}>
            Sort
          </MenuButton>
          <MenuList>
            <MenuOptionGroup defaultValue="low" title="Sort by" type="radio">
              <MenuItemOption value="low">Price: low to high</MenuItemOption>
              <MenuItemOption value="high">Price: high to low</MenuItemOption>
              <MenuItemOption value="recent">Recently Listed</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Flex>

      
    </Flex>
    <Flex>
    <SideSearchTab
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      onOpen={() => setIsSidebarOpen(true)}
      selectedSubjects={selectedSubjects}
      setSelectedSubjects={setSelectedSubjects}
      selectedConditions={selectedConditions}
      setSelectedConditions={setSelectedConditions}
      selectedDepartment={selectedDepartment}
      setSelectedDepartment={setSelectedDepartment}
      selectedCatalogNumber={selectedCatalogNumber}
      setSelectedCatalogNumber={setSelectedCatalogNumber}
      onApplyFilters={(filters) => {
        handleApplyFilters(filters);
        setIsSidebarOpen(false); // also close it after applying filters
      }}
    />

      <Box p={4} bg="white" minHeight="100vh">
      <Box w={{ base: "100%", md: "95%" }} mx="auto">
        <Grid 
          templateColumns={{
            base: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)', 
            xl: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          {books.length > 0 ? books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onToggleFavorite={handleToggleFavorite} 
              currentUser={currentUser}
            />
          )) : (
            <Flex
              alignItems="center" // Adjust height to account for the navbar height
            >
            <Text
              paddingLeft="100%"
              fontFamily="NanumMyeongjo"
              fontSize="xl"
              textAlign="center"
              whiteSpace="nowrap"
              >No products found.</Text>
              </Flex>
          )}

        </Grid>
        </Box>
      </Box>
    </Flex>
    </Box>
  );
};

  {/*BACKEND CONNECT STUFF*/}
  // const [ products, setProducts ] = useState([]);
  // const { currentUser } = useAuth();
  // // const navigate = useNavigate();

  // const fetchProductsList = useCallback(async () => {
  //   try {
  //     const productsList = await fetchProducts();
  //     setProducts(productsList);
  //   } catch (error) {
  //     console.error("Error fetching products: ", error);
  //   }
  // }, []);
  
  // useEffect(() => {
  //   if (currentUser) {
  //     fetchProductsList();
  //   }
  // }, [currentUser, fetchProductsList]);

  // // Handler functions to pass to ProductCard
  // const handleProductDelete = () => {
  //   fetchProductsList(); // Re-fetch products after deletion
  // };

  // const handleProductUpdate = () => {
  //   fetchProductsList(); // Re-fetch products after update
  // };

  // if (!currentUser) {
  //   return <Navigate to="/login" replace />;
  // }

  // return (
  //   <Container maxW='container.xl' py={12}>
  //     <VStack space={8}>
  //       <SimpleGrid
  //         columns={{ // number of columns for different screen sizes
  //           base: 1,
  //           md: 2,
  //           lg: 4
  //         }}
  //         spacing={10}
  //         w={"full"}
  //       >
  //         {products.map((product) => (
  //           <ProductCard
  //           key={product.id}
  //           product={product}
  //           onDelete={handleProductDelete}
  //           onUpdate={handleProductUpdate}
  //           />
  //         ))}
  //       </SimpleGrid> 


  //       {products.length === 0 && (
  //         <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
  //           No products found 😢{" "}
  //           <Link to={"/create"}>
  //             <Text as='span' color='blue.500' _hover={{ textDecoration: "underline" }}>
  //               Create a product
  //             </Text>
  //           </Link>
  //         </Text>
  //       )}
  //     </VStack> 
  // </Container>
  // )

export default HomePage;
