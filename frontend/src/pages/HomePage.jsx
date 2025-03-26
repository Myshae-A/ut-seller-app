import { Container, VStack, Text, SimpleGrid, Spinner, Center } from '@chakra-ui/react';
import { Link, Navigate } from 'react-router-dom'; // useNavigate
import { useEffect, useState, useCallback } from 'react'; // useState
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { fetchProducts } from '../services/api';

const HomePage = () => {

  const [ products, setProducts ] = useState([]);
  const { currentUser } = useAuth();
  // const navigate = useNavigate();

  const fetchProductsList = useCallback(async () => {
    try {
      const productsList = await fetchProducts();
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      fetchProductsList();
    }
  }, [currentUser, fetchProductsList]);

  // Handler functions to pass to ProductCard
  const handleProductDelete = () => {
    fetchProductsList(); // Re-fetch products after deletion
  };

  const handleProductUpdate = () => {
    fetchProductsList(); // Re-fetch products after update
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxW='container.xl' py={12}>
      <VStack space={8}>
        <SimpleGrid
          columns={{ // number of columns for different screen sizes
            base: 1,
            md: 2,
            lg: 4
          }}
          spacing={10}
          w={"full"}
        >
          {products.map((product) => (
            <ProductCard
            key={product.id}
            product={product}
            onDelete={handleProductDelete}
            onUpdate={handleProductUpdate}
            />
          ))}
        </SimpleGrid> 


        {products.length === 0 && (
          <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
            No products found 😢{" "}
            <Link to={"/create"}>
              <Text as='span' color='blue.500' _hover={{ textDecoration: "underline" }}>
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack> 
    </Container>
  )
};
export default HomePage;
