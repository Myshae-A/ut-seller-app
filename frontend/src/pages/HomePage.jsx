import { Container, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/product';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-client';

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // console.log("products", products);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        console.log("user detected 1: "+user.uid);
        setCurrentUser(user.uid)
        
      } else {
        console.log("no user detected 2: "+user.uid);
        setCurrentUser(null)
        navigate('/login');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!isLoading && currentUser == null) {
      navigate('/login');
    } else {
        fetch(`https://ut-seller-app.vercel.app/users/${currentUser}/listings`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if(data.length > 0) {
            // setTaskList(data); // Update taskList with the fetched data
            console.log("1.0 use effect here : "+data)
          }
          
        })
        .catch((error) => {
          console.error("'use effect FAILED TO FETCH: ", error);
        });
      }
  }, [currentUser]);

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
            <ProductCard key={product._id} product={product} />
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
