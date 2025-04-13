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
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
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
import InfiniteScroll from 'react-infinite-scroll-component';


const BookCard = ({ book, onToggleFavorite, currentUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgIndex, setImgIndex] = useState(0);
  const toast = useToast();
  // const { updateBooksRequested } = useAuth(); // Assuming you have a context or state management for this

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
            fontSize="sm" 
            fontWeight="light"
            color="gray.500"
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

const HomePage = () => {

  const { currentUser } = useAuth();
  // Olivia's working code
  const [books, setBooks] = useState([]);
  // const toast = useToast();
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if more products are available


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
      // setPage((prevPage) => prevPage + 1); // Increment the page number
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMoreProducts(); // Load the first page of products
    }
  }, []);

  // Fetch products from Firestore when the component mounts
  // useEffect(() => {
  //   const loadProducts = async () => {
  //     try {
  //       const cachedProducts = localStorage.getItem("products");
  //       console.log("Cached products:", cachedProducts); // Debugging line
  //       if (cachedProducts) {
  //         setBooks(JSON.parse(cachedProducts)); // Use cached data
  //         return;
  //       }

  //       const products = await fetchProducts(); // Fetch products from Firestore
  //       setBooks(products); // Update the state with fetched products
  //       localStorage.setItem("products", JSON.stringify(products)); // Cache the data
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to load products. Please try again later.",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   };

  //   loadProducts();
  // }, []);

  const handleToggleFavorite = (bookId) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId 
          ? { ...book, favorite: !book.favorite } 
          : book
      )
    );
  };

  // Myshae's previous code
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

  return (
    <>
    <Banner />
    
    <Flex>
      
      <SideSearchTab />
      <Box p={4} bg="gray.50" minHeight="100vh">
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
    </Flex>
    </>
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
