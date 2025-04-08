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
import { HiHeart } from "react-icons/hi"
import ProductCard from '../components/ProductCard';
import SideSearchTab from '../components/SideBar';
import { fetchProducts } from '../services/api';
import { useEffect } from 'react';
import Banner from '../components/Banner';

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
        
        <Box p={3} position="relative">
          <Text 
            fontWeight="bold" 
            fontSize="sm" 
            noOfLines={1} 
            mb={2}
          >
            {book.title}
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
            {book.price}
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
                  alt={book.title}
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
              <Text fontSize="xl" mb={2}>{book.title}</Text>
                
              <Text fontWeight="bold" mb={2}>Price: {book.price}</Text>

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
                >
                  {/*no link functionality yet*/}
                  <Link to={`/account`} style={{ fontWeight:'lighter' }}>
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

  // Olivia's working code
  const [books, setBooks] = useState([]);
  const toast = useToast();

  // Fetch products from Firestore when the component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts(); // Fetch products from Firestore
        setBooks(products); // Update the state with fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadProducts();
  }, [toast]);

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
