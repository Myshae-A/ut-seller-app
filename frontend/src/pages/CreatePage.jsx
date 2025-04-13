import { Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
  Textarea,
  Text,
  Grid,
  GridItem,
  IconButton,
  Image,
  useColorModeValue,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { uploadImage } from '../services/uploadImage'; // Assuming you have a function to upload images to Firebase Storage
import { useNavigate } from 'react-router-dom';
import { addProductToGlobal, addProductToUser } from '../services/api'; // uploadImage
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext to get the current user

const CreatePage = () => {

  // Access current user form AuthContext
  const { currentUser } = useAuth(); 

  // Expanded product state to include all fields
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    subject: "",
    department: "",
    condition: "",
    catalogNumber: "",
    description: "",
    status: ""
  });
  
  // State for handling multiple images
  // const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState(Array(4).fill(null));
  const [imageUrls, setImageUrls] = useState(Array(4).fill(""));
  const [isUploading, setIsUploading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const placeholderBg = useColorModeValue('gray.100', 'gray.700');

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleImageChange = (e) => {
  //   setImageFile(e.target.files[0]);
  // };

  // Handle image selection
  const handleImageSelect = (index) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Update the files array
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = selectedFile;
      setImageFiles(newImageFiles);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = previewUrl;
      setImageUrls(newImageUrls);
      
      // If this is the first image, update the product state
      if (index === 0) {
        setNewProduct(prev => ({
          ...prev,
          image: "pending-upload" // We'll replace this with the actual URL after upload
        }));
      }
    }
  };

  // Function to upload images to Firebase Storage
  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      if (imageFile) {
        try {
          // Create a unique path for the image
          // const imagePath = `products/${Date.now()}-${imageFile.name}`;
          // const imageRef = ref(storage, imagePath);
          
          // // Upload the image
          // await uploadBytes(imageRef, imageFile);
          
          // Get the download URL
          const downloadUrl = await uploadImage(imageFile, currentUser.uid, "products");
          uploadedUrls.push(downloadUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      }
    }
    
    return uploadedUrls;
  };

  // Handle product submission
  const handleAddProduct = async () => {
    try {
      // Basic validation
      if (!newProduct.name || !newProduct.price) {
        toast({
          title: "Error",
          description: "Name and price are required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Check if at least one image is selected
      if (!imageFiles.some(file => file !== null)) {
        toast({
          title: "Error",
          description: "At least one image is required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setIsUploading(true);
      
      // Upload images and get URLs
      const uploadedImageUrls = await uploadImages();
      
      // Format the product data
      const formattedProduct = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        image: uploadedImageUrls[0], // Main image is the first one
        additionalImages: uploadedImageUrls.slice(1).filter(url => url), // Additional images
        createdAt: new Date().toUTCString(),
        userPosted: currentUser.uid,
        usersRequested: [],
        status: "posted",
        soldTo: "",
      };
      
      // Add the product to the global database of all products
      const updatedProduct = await addProductToGlobal(formattedProduct);
      // const productId = await addProductToGlobal(formattedProduct);

      // formattedProduct.id = productId; // Add the product ID to the formatted product

      // console.log("Generated Product ID: ", productId); // WORKS!!!

      const userId = currentUser.uid; // Assuming you have a way to get the current user's ID
      // console.log("user id: ", userId);
      // Add the same product to the user's individual posted products
      await addProductToUser(userId, updatedProduct);

      toast({
        title: "Success",
        description: "Book listed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Reset the form
      setNewProduct({
          name: "",
          price: "",
          image: "",
          subject: "",
          department: "",
          condition: "",
          catalogNumber: "",
          description: "",
          status: "",
          soldTo: "",
      });
      setImageFiles(Array(4).fill(null));
      setImageUrls(Array(4).fill(""));
      
      // go to your account page after posting/creating a product
      navigate("/account");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Hidden file input elements for image uploads
  // const fileInputRefs = Array(4).fill().map(() => React.createRef());

  return (
    <Box
      maxW="1000px"
      mx="auto"
      p={4}
      bg="white"
      mt={8}
    >
      <Flex justify="space-between" align="center" mb={4}>
      <Text 
        fontSize="xl"
        fontWeight="medium"
        lineHeight="normal"
      >
        List A Book
      </Text>
      <IconButton
        icon={<CloseIcon />}
        size="sm"
        borderRadius="full"
        aria-label="Close"
        bg="gray.200"
        onClick={() => navigate("/home")}
      />
    </Flex>

      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        {/* Left side - Image upload area */}
        <Box 
          w={{ base: '80%', md: '60%' }} 
          borderRadius="md"
          position="relative"
          pb={4}
        >
          <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
            {imageFiles.map((_, idx) => (
              <GridItem key={idx}>
                <Box 
                  h="200px" 
                  bg={placeholderBg} 
                  borderRadius="md" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  border="3px dashed"
                  borderColor="gray.300"
                  cursor="pointer"
                  onClick={() => document.getElementById(`file-input-${idx}`).click()}
                  overflow="hidden"
                >
                  {imageUrls[idx] ? (
                    <Image 
                      src={imageUrls[idx]} alt={`Preview ${idx}`} boxSize="100%"
                      // alt={`Book image ${idx + 1}`} 
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  ) : (
                    <VStack spacing={1}>
                      <Box as="span" fontSize="xl">🖼️</Box>
                      <Text fontSize="xs" color="gray.500">add an image</Text>
                    </VStack>
                  )}
                  <Input
                    id={`file-input-${idx}`}
                    type="file"
                    // ref={fileInputRefs[idx]}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageSelect(idx)}
                  />
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>
        
        {/* Right side - Book details form */}
        <Box 
          h="200px" 
          w={{ base: '100%', md: '40%' }} 
          borderRadius="md"
          pb={4}
          position="relative"
        >
          <VStack spacing={4} p={4} align="stretch">
            <FormControl>
              <Input 
                name="name" 
                value={newProduct.name}
                onChange={handleInputChange}
                variant="filled" 
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                placeholder="Title" 
              />
            </FormControl>
            
            <FormControl maxWidth="40%">
              <Input 
                name="price" 
                value={newProduct.price}
                onChange={handleInputChange}
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                variant="filled" 
                placeholder="Price" 
                type="number"
              />
            </FormControl>
            
            <Flex gap={2}>
              <Select 
                name="subject" 
                value={newProduct.subject}
                onChange={handleInputChange}
                placeholder="Subject" 
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                variant="filled" 
                size="md"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Reference">Reference</option>
              </Select>
              
              <Select 
                name="department" 
                value={newProduct.department}
                onChange={handleInputChange}
                placeholder="Department" 
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                variant="filled" 
                size="md"
              >
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
              </Select>
            </Flex>
            
            <Flex gap={2}>
              <Select 
                name="condition" 
                value={newProduct.condition}
                onChange={handleInputChange}
                placeholder="Condition" 
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                variant="filled" 
                size="md"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </Select>
              
              <Select 
                name="catalogNumber" 
                value={newProduct.catalogNumber}
                onChange={handleInputChange}
                placeholder="Catalog Number" 
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                variant="filled" 
                size="md"
              >
                <option value="ISBN">ISBN</option>
                <option value="UPC">UPC</option>
                <option value="SKU">SKU</option>
              </Select>
            </Flex>
            
            <FormControl>
              <Textarea 
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Description" 
                bg={'gray.300'}
                _hover={{ bg: 'gray.400' }}
                _focus={{ bg: 'gray.400' }}
                variant="filled" 
                size="md" 
              />
            </FormControl>
          </VStack>
        </Box>
      </Flex>
      
      {/* Upload button */}
      <Flex justify="flex-end" mt={4}>
        <Button 
          bgColor={"rgb(221, 147, 51)"} 
          size="md" 
          px={10}
          position="relative"
          onClick={handleAddProduct}
          isLoading={isUploading}
          loadingText="Uploading"
        >
          Upload
        </Button>
      </Flex>
    </Box>
  );
};

export default CreatePage;
