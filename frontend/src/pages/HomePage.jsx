import { Container, VStack, Text, SimpleGrid, Spinner, Center } from '@chakra-ui/react';
import { Link, Navigate } from 'react-router-dom'; // useNavigate
import { useEffect, useState, useCallback } from 'react'; // useState
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase-client';

const HomePage = () => {

  const [products, setProducts] = useState([]);
  const { currentUser } = useAuth();
  // const navigate = useNavigate();
  // const [currentUser, setCurrentUser] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);

      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser, fetchProducts]);
  // console.log("products", products);

  // Handler functions to pass to ProductCard
  const handleProductDelete = () => {
    fetchProducts(); // Re-fetch products after deletion
  };

  const handleProductUpdate = () => {
    fetchProducts(); // Re-fetch products after update
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxW='container.xl' py={12}>
      <VStack space={8}>
        <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgGradient={"linear(to-r, cyan.400, blue.500)"}
            bgClip={"text"}
            textAlign={"center"}
          >
            Current Products 🚀
        </Text>

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
