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
  Tooltip,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { uploadImage } from '../services/uploadImage'; // Assuming you have a function to upload images to Firebase Storage
import { useNavigate } from 'react-router-dom';
import { addProductToGlobal, addProductToUser } from '../services/api'; // uploadImage
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext to get the current user
import Navbar from '../components/Navbar';


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
    status: "",
    meetupLocation: "",
    meetupDateTime: "",
    contactInfo: "",
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
        meetupLocation: newProduct.meetupLocation,
        meetupDateTime: newProduct.meetupDateTime,
        contactInfo: newProduct.contactInfo
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
          meetupLocation: "",
          meetupDateTime: "",
          contactInfo: "",
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
    <>
      <Navbar
        searchQuery={""}
        handleSearchInput={() => {}}
        handleSearchKeyDown={() => {}}
      />
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
              <FormControl isRequired>
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
              
              <FormControl isRequired maxWidth="40%">
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
                  <option value="Math">Math</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Visual and Performing Arts">Visual and Performing Arts</option>
                  <option value="1st-Year Signature Course">1st-Year Signature Course</option>
                  <option value="Government">Government</option>
                  <option value="History">History</option>
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
                  <option value="Butler School of Music">Butler School of Music</option>
                  <option value="College of Education">College of Education</option>
                  <option value="College of Fine Arts">College of Fine Arts</option>
                  <option value="College of Liberal Arts">College of Liberal Arts</option>
                  <option value="College of Natural Sciences">College of Natural Sciences</option>
                  <option value="College of Pharmacy">College of Pharmacy</option>
                  <option value="Cockrell School of Engineering">Cockrell School of Engineering</option>
                  <option value="Jackson School of Geosciences">Jackson School of Geosciences</option>
                  <option value="Lyndon B. Johnson School of Public Affairs">Lyndon B. Johnson School of Public Affairs</option>
                  <option value="McCombs School of Business">McCombs School of Business</option>
                  <option value="Moody College of Communication">Moody College of Communication</option>
                  <option value="Pre-Med, Pre-Law & Teaching">Pre-Med, Pre-Law & Teaching</option>
                  <option value="School of Civic Leadership">School of Civic Leadership</option>
                  <option value="School of Information">School of Information</option>
                  <option value="School of Nursing">School of Nursing</option>
                  <option value="Steve Hicks School of Social Work">Steve Hicks School of Social Work</option>

                </Select>
              </Flex>
              
              <Flex gap={2}>
                <Select isRequired
                  name="condition" 
                  value={newProduct.condition}
                  onChange={handleInputChange}
                  placeholder="Condition" 
                  bg={'gray.300'}
                  _hover={{ bg: 'gray.400' }}
                  _focus={{ bg: 'gray.400' }}
                  variant="filled" 
                  size="md"
                  flex={1.2}
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Gently Used">Gently Used</option>
                  <option value="Fairly Used">Fairly Used</option>
                  <option value="Heavily Used">Heavily Used</option>

                </Select>
                
                <Select 
                  name="meetupLocation" 
                  value={newProduct.meetupLocation}
                  onChange={handleInputChange}
                  placeholder="Meetup Spot" 
                  bg={'gray.300'}
                  _hover={{ bg: 'gray.400' }}
                  _focus={{ bg: 'gray.400' }}
                  variant="filled" 
                  size="md"
                  flex={2}
                >
                  <option value="UT Tower: Main Entrance">UT Tower: Main Entrance</option>
                  <option value="The Union: Ground Lobby">The Union: Ground Lobby</option>
                  <option value="Co-op: Inside Entrance">Co-op: Inside Entrance</option>
                  <option value="PCL Library: Entrance">PCL Library: Entrance</option>
                  <option value="Littlefield Fountain">Littlefield Fountain</option>
                  <option value="Kins Dining: Entrance">Kins Dining: Entrance</option>
                  <option value="J2 Dining: Entrance">J2 Dining: Entrance</option>
                  <option value="Gregory Gym: Lobby">Gregory Gym: Lobby</option>
                  <option value="Rec Center: Lobby">Rec Center: Lobby</option>
                  <option value="WCP: Chick-fil-A">WCP: Chick-fil-A</option>
                  <option value="GDC: Main Lobby">GDC: Main Lobby</option>
                  {/* add more as needed */}
                </Select>
              </Flex>
              
                <FormControl>
                <FormLabel
                  // centered to middle
                  textAlign="center"
                >Meetup Date & Time</FormLabel>
                <Input
                  name="meetupDateTime"
                  type="datetime-local"
                  placeholder="Meetup Date & Time"
                  _placeholder={{ color: "gray.500", fontStyle: "italic" }}
                  value={newProduct.meetupDateTime}
                  onChange={handleInputChange}
                  variant="filled"
                  bg="gray.300"
                  _hover={{ bg: "gray.400" }}
                  _focus={{ bg: "gray.400" }}
                />

              </FormControl>
              

              {/* 3) Contact info input */}
              <FormControl>
                <Input
                  name="contactInfo"
                  value={newProduct.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Contact info: (email and/or phone)"
                  variant="filled"
                  bg="gray.300"
                  _hover={{ bg: 'gray.400' }}
                  _focus={{ bg: 'gray.400' }}
                />
              </FormControl>

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
            color="white"
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </>
  );
  
};

export default CreatePage;
