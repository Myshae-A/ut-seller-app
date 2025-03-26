import { 
  Box, 
  Flex,
  Text, 
  Image, 
  Grid, 
  VStack, 
  HStack, 
  Badge, 
  IconButton,
  Button 
} from '@chakra-ui/react';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { StarIcon } from '@chakra-ui/icons';
import american from '../images/american.jpg';
import linear from '../images/linear.jpg';
import SideSearchTab from '../components/SideBar';

// Hardcoded book metadata
const initialBooks = [
  {
    id: 1,
    title: 'American Art: History and Culture, Revised First Edition',
    image: american,
    categories: ['history', 'visual and performing arts'],
    condition: 'like new',
    price: '$27.50',
    favorite: false
  },
  {
    id: 2,
    title: 'Linear Algebra & Its Applications 5E',
    image: linear,
    categories: ['math'],
    condition: 'gently used',
    price: '$60.00',
    favorite: false
  },
  {
    id: 3,
    title: 'Linear Algebra Done Right (Undergraduate - Hardcover)',
    image: american,
    categories: ['math', 'brand new'],
    condition: 'brand new',
    price: '$52.20',
    favorite: false
  },
];

const BookCard = ({ book, onToggleFavorite }) => {
  return (    
      <Box 
        borderWidth="1px" 
        overflow="hidden" 
        position="relative"
        height="100%"
        bg="white"
        boxShadow="sm"
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.02)' }}
      >
        <Box height="180px" bg="gray.100" position="relative">
          <Image 
            src={book.image} 
            alt={book.title}
            fallbackSrc="https://via.placeholder.com/150"
            objectFit="cover"
            width="100%"
            height="100%"
          />
          <IconButton
            aria-label="Add to favorites"
            icon={<StarIcon />}
            size="sm"
            position="absolute"
            top="2"
            right="2"
            borderRadius="full"
            colorScheme={book.favorite ? "red" : "gray"}
            onClick={() => onToggleFavorite(book.id)}
          />
        </Box>
        
        <Box p="3">
          <Text 
            fontWeight="semibold" 
            fontSize="sm" 
            noOfLines={2}
            mb="2"
          >
            {book.title}
          </Text>
          
          <HStack mb="2" flexWrap="wrap" spacing="1">
            {book.categories.map((category, idx) => (
              <Badge 
                key={idx} 
                colorScheme="gray" 
                fontSize="xx-small"
                px="1"
              >
                {category}
              </Badge>
            ))}
          </HStack>
          
          <Badge 
            colorScheme="blue" 
            fontSize="xx-small"
            mb="2"
          >
            {book.condition}
          </Badge>
          
          <Text 
            fontWeight="bold" 
            color="gray.700"
            fontSize="sm"
          >
            {book.price}
          </Text>
        </Box>
      </Box>
  );
};

const HomePage = () => {

  const [books, setBooks] = useState(initialBooks);

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
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onToggleFavorite={handleToggleFavorite} 
            />
          ))}
        </Grid>
      </Box>
    </Flex>
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
