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
  Button 
} from '@chakra-ui/react';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { HiHeart } from "react-icons/hi"
import ProductCard from '../components/ProductCard';
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
      overflow="hidden"
      display="flex" 
      p={4}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems="center" 
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
          onClick={() => onToggleFavorite(book.id)}
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
            fill={book.favorite ? 'red' : 'none'}
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
              bgColor={"rgba(221, 147, 51, 0.47)"}
              borderRadius={30}
              p={1}
              px={2}
              fontSize="x-small"
              fontWeight={"semibold"}
            >
              {cat}
            </Badge>
          ))}
          
          {book.condition && (
            <Badge 
              bgColor={"rgba(221, 147, 51, 0.47)"}
              borderRadius={30}
              p={1}
              px={2}
              fontSize="x-small"
              fontWeight={"semibold"}
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
