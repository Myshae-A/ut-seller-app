import { VStack, Container, Heading, Box, useColorModeValue, Input, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
// import { useProductStore } from "../store/product";
// import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import db from "../firebase-client";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleAddProduct = async() => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.image) {
        toast({
          title: "Error",
          description: "All fields are required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      // Format the price as a number
      const formattedProduct = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        createdAt: serverTimestamp()
      };
  
      // Add the product to the database
      await addDoc(collection(db, "products"), formattedProduct);
      // tester code,  to see it working in console:
      // const docRef = await addDoc(collection(db, "products"), formattedProduct);
      // console.log("Document written with ID: ", docRef.id);
      
      toast({
        title: "Success",
        description: "Product added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Reset the form
      setNewProduct({ name: "", price: "", image: "" });
      navigate("/home");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return <Container maxW={"container.sm"}>
    <VStack spacing={8}>
      <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
        Create New product
      </Heading>

      <Box w={"full"} bg={useColorModeValue("white", "gray.800")}
        p={6} rounded={"lg"} shadow={"md"}>
        <VStack spacing={4}>
          <Input
            placeholder={"Product Name"}
            name='name'
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />

          <Input
            placeholder={"Price"}
            name='price'
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />

          <Input
            placeholder={"Image URL"}
            name='image'
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />

          <Button colorScheme='blue' onClick={handleAddProduct} w='full'>
            Add Product
          </Button>
        </VStack>
      </Box>
    </VStack>
  </Container>;
};
export default CreatePage;
