import {
  Avatar, 
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
  Menu,
  MenuList,
  MenuButton,
  MenuItem, 
  MenuItemOption,
  MenuOptionGroup,
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  Select,
  useDisclosure,
  useToast,
  Tooltip,
  useClipboard,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { FiFilter, FiFlag } from 'react-icons/fi';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link, Navigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { HiHeart } from "react-icons/hi";
import SideSearchTab from '../components/SideBar';
import {
  fetchProducts,
  fetchProductById,
  addProductToUser,
  updateUsersRequestedGlobally,
  updateUserFavorite,
  fetchUserFavorites,
} from '../services/api';
import Banner from '../components/Banner';
import { useAuth } from "../contexts/AuthContext";
//import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from '../components/Navbar';
import React from 'react';
import confetti from "canvas-confetti";


const BookCard = ({
  book,
  onToggleFavorite,
  currentUser,
  onRequestMade,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgIndex, setImgIndex] = useState(0);
  const toast = useToast();
  // const { updateBooksRequested } = useAuth(); // Assuming you have a context or state management for this
  const images = [book.image, ...(book.additionalImages || [])];
  const closeBtnRef = useRef(null);

  const tags = [
    ...(book.subject ? [book.subject] : []),
    ...(book.condition ? [book.condition] : []),
    ...(book.department ? [book.department] : []),
  ];
  const [profileImage, setProfileImage] = useState("");
  const maxTotalLength = 20; // Adjust this number to fit your layout
  let totalLength = 0;
  const visibleTags = [];
  const hiddenTags = [];

  tags.forEach((tag) => {
    if (totalLength + tag.length <= maxTotalLength) {
      visibleTags.push(tag);
      totalLength += tag.length;
    } else {
      hiddenTags.push(tag);
    }
  });


  const subjectColors = {
      math: '#F33A3A40',
      english: '#E8C81740',
      science: '#7EC74340',
      'visual and performing arts': '#DD933340',
      'first-year signature course': '#D553AC40',
      government: '#9434E340',
      history: '#50B8F040',
    };
  
    const [showSharePopup, setShowSharePopup] = useState(false);
    const shareUrl = `https://yourapp.com/listings/${book.id}`; // replace with actual URL
    const { hasCopied, onCopy } = useClipboard(shareUrl);
    //const { isOpen, onOpen, onClose } = useDisclosure();
    const [showReportOverlay, setShowReportOverlay] = useState(false);


  const handleNextImage = () => {
    setImgIndex(i => (i + 1) % images.length);
  };
  const handlePrevImage = () => {
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
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
      console.log("FINAL 1");

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
      setTimeout(async () => {
        await addProductToUser(userId, formattedProduct);
      }, 500); // Adjust the delay as needed
      console.log("FINAL 2");

      setTimeout(async () => {
        await updateUsersRequestedGlobally(userId, book.id, userPostedId);
      }, 500); // Adjust the delay as needed
      console.log("FINAL 3");
      

      console.log("requested Product here, new testgin"+JSON.stringify(formattedProduct));

      onRequestMade(book.id); // Call the function to update the user's requested products in the parent component
      // PRAISE GOD!! YAY it workssss!!!!!!!


      // fire confetti!
      const count = 200
      const defaults = { origin: { y: 0.7 } }
      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          zIndex: 9999,
          particleCount: Math.floor(count * particleRatio)
        })
      }
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2,  { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1,  { spread: 120, startVelocity: 45 })


      // might take this onClose out and add confetti instead...
      // onClose(); // Close the modal after making the request

      // toast({
      //   title: "Success",
      //   description: "Request sent! 🎉",
      //   status: "success",
      //   duration: 3000,
      //   isClosable: true,
      //   position: "top",
      // });
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

  const already = book.usersRequested.includes(currentUser.uid)
  
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

          {book.status === "requested" && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)" // Transparent gray background
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius={15}
              zIndex={1}               // above the image
            >
              {/* solid pill behind the text */}
              <Box bg="blue.600" px={20} borderRadius="md">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="white"         // white for contrast
                  textAlign="center"
                  lineHeight="1"
                  transform="translateY(6px)"
                >
                  REQUESTED
                </Text>
              </Box>
            </Box>
          )}

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
          
          <Flex gap={1} mb={2} flexWrap="wrap">
            {visibleTags.map((tag, idx) => {
              // let bgColor = "gray.300";               // fallback
              // if (tag === book.subject) {
              //   bgColor = "rgba(200,226,240,1)";
              // } else if (tag === book.condition) {
              //   bgColor = "rgba(221,147,51,0.47)";
              // } else if (tag === book.department) {
              //   bgColor = "rgba(231,185,216,1)";
              // }
              return (
                <Badge
                  key={idx}
                  bgColor={subjectColors[tag.toLowerCase()] || "rgba(221, 147, 51, 0.47)"}
                  borderRadius="30px"
                  px={2}
                  py={1}
                  fontSize="x-small"
                  fontWeight="semibold"
                  whiteSpace="nowrap"
                >
                  {tag}
                </Badge>
              );
            })}
            {hiddenTags.length > 0 && (
              <Badge
                bgColor="gray.300"
                borderRadius={30}
                p={1}
                px={2}
                fontSize="x-small"
                fontWeight="semibold"
              >
                +{hiddenTags.length}
              </Badge>
            )}
          </Flex>
          
          <Text 
            fontSize="sm" 
            fontWeight="light"
            color="black"
          >
            ${book.price}
          </Text>
        </Box>
      </Box>

      <Modal
      initialFocusRef={closeBtnRef}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      >
        <ModalOverlay />
        <ModalContent 
          borderRadius={15} 
          border="2px solid"
          borderColor="gray.600"
          bgColor="rgb(226, 225, 225)"
          p={5}
        >
          <Flex direction={{ base: 'row' }} p={5} gap={4}>
            <Box 
              w={{ base: '40%', md: '40%', sm: '50%' }} 
              borderRadius="md"
              mb={4}
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* Carousel image */}
              <Image 
                  // src={book.image} // show current image - got rid of book.image[imgIndex]
                  src={images[imgIndex]}
                  alt={book.title}
                  objectFit="cover"
                  width="200px"
                  height="300px"
                  borderRadius="10px"
                  mr={4}
                  onClick={handleNextImage} // cycle to next image
                  cursor="pointer"
                />

              
              {/* 4) Prev / Next arrows */}
              <Flex mt={2} gap={2} justifyContent="center">
              <Tooltip
                label={images.length === 1
                  ? '1 image'
                  : `${imgIndex + 1}/${images.length}`}
                placement="top"
                hasArrow
              >
              <IconButton
                icon={<ChevronLeftIcon w={8} h={8} />}
                aria-label="Previous image"
                variant="solid"
                bg="whiteAlpha.900"    // white @ 80% opacity
                color="black"
                opacity={0.85}
                position="absolute"
                left="-20px"
                top="50%"
                transform="translateY(-50%)"
                onClick={e => { e.stopPropagation(); handlePrevImage() }}
              />
              </Tooltip>

              <Tooltip
                label={images.length === 1
                  ? '1 image'
                  : `${imgIndex + 1}/${images.length}`}
                placement="top"
                hasArrow
              >
              <IconButton
                icon={<ChevronRightIcon w={8} h={8} />}
                aria-label="Next image"
                variant="solid"
                bg="whiteAlpha.900"    // white @ 80% opacity
                color="black"
                opacity={0.85}
                position="absolute"
                right="-5px"
                top="50%"
                transform="translateY(-50%)"
                onClick={e => { e.stopPropagation(); handleNextImage() }}
              />
              </Tooltip>
              </Flex>
              
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
            <ModalCloseButton ref={closeBtnRef}/>
            <ModalBody>
              <Flex
                flexDirection="column"
                gap={1}
                h="100%">
              <Text fontWeight="bold" fontSize="xl" mb={2}>{book.name}</Text>
                
              <Text  mb={2}>Price: ${book.price}</Text>

                <Box>
                  <Flex gap={2} mb={2} flexWrap="wrap">
                    {book.subject && (
                      <Badge 
                        bgColor="rgba(200,226,240,1)"
                        borderRadius={30}
                        p={1}
                        px={2}
                        fontSize="x-small"
                        fontWeight="semibold"
                      >
                        {book.subject}
                      </Badge>
                    )}
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
                    {book.department && (
                      <Badge 
                        bgColor="rgba(231,185,216,1)"
                        borderRadius={30}
                        p={1}
                        px={2}
                        fontSize="x-small"
                        fontWeight="semibold"
                      >
                        {book.department}
                      </Badge>
                    )}
                  </Flex>
                </Box>
                <Button
                  bgColor={"rgb(221, 147, 51)"}
                  borderRadius={20}
                  onClick={handleMakeRequest}
                  isDisabled={already}
                >
                  {/*no link functionality yet*/}
                  {/* <Link style={{ fontWeight:'lighter' }}>
                  {book.usersRequested.includes(currentUser.uid)
                    ? "Already Requested"
                    : "Make a Request"}
                  </Link> */}
                  {already ? (
                    // just plain text — no click
                    <Text
                      fontWeight="lighter"
                      paddingTop="5%"
                    >Already Requested</Text>
                  ) : (
                    // real link only when not requested
                    <Link to="#" style={{ fontWeight: 'lighter' }}>
                      Make a Request
                    </Link>
                  )}
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
                    {/* <IconButton
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
                    /> */}
                    <Button
                          bgColor="rgba(221, 147, 51, 0.47)"
                          borderRadius={20}
                          p={1}
                          px={5}
                          fontSize="sm"
                          fontWeight="semibold"
                          onClick={() => {
                            onCopy();
                            toast({
                              title: "Link copied!",
                              description: "The listing link has been copied to your clipboard.",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          }}
                        >
                      <Icon
                            as={() => (
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
                            )}
                          />
                        </Button>
                  {showSharePopup && (
                    <Box
                      position="fixed"
                      top="0"
                      left="0"
                      w="100vw"
                      h="100vh"
                      bg="rgba(0, 0, 0, 0.4)"
                      zIndex="2000"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        bg="white"
                        p={6}
                        borderRadius="md"
                        maxW="400px"
                        w="90%"
                        boxShadow="lg"
                      >
                        <Text fontSize="lg" fontWeight="semibold" mb={3}>
                          Share this listing
                        </Text>

                        <VStack spacing={3}>
                          <Input value={shareUrl} isReadOnly bg="gray.100" />
                          <Button
                            size="sm"
                            onClick={() => {
                              onCopy();
                              toast({
                                title: "Link copied!",
                                description: "The listing link has been copied to your clipboard.",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                              });
                            }}
                            colorScheme="blue"
                            w="100%"
                          >
                            Copy Link
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSharePopup(false)}
                          >
                            Cancel
                          </Button>
                        </VStack>
                      </Box>
                    </Box>
                  )}

                   <Button
                      bgColor="rgba(221, 147, 51, 0.47)"
                      borderRadius={20}
                      p={1}
                      px={5}
                      fontSize="sm"
                      fontWeight="semibold"
                      onClick={() => setShowReportOverlay(true)}
                     >
                    <Icon as={FiFlag} />
                    </Button>

                    {showReportOverlay && (
                      <Box
                        position="fixed"
                        top="0"
                        left="0"
                        w="100vw"
                        h="100vh"
                        bg="rgba(0, 0, 0, 0.4)"
                        zIndex="2000"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box
                          bg="white"
                          p={8}
                          borderRadius="md"
                          maxW="500px"
                          w="90%"
                          boxShadow="lg"
                        >
                          <Text fontSize="lg" mb={4}>
                            Why are you reporting this listing?
                          </Text>
                          <VStack spacing={3}>
                            <Select placeholder="Select reason" bgColor="#D9D9D9">
                              <option value="spam" >Spam</option>
                              <option value="inappropriate">Inappropriate content</option>
                              <option value="misleading">Misleading information</option>
                            </Select>
                            <Textarea placeholder="Please Explain" bgColor="#D9D9D9" />
                            <Button
                              bgColor="#DD8533"
                              color="white"
                              w="100%"
                              borderRadius="full"
                              onClick={() => setShowReportOverlay(false)}
                            >
                              Report Listing
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowReportOverlay(false)}
                            >
                              Cancel
                            </Button>
                          </VStack>
                        </Box>
                      </Box>
                    )}

                  </Flex>
                </Box>
                    
                <Text  mb={2}>{book.catalogue}</Text>
                {/* <Text mb={2}>
                  Meetup Date:{' '}
                  {book.meetupDateTime
                    ? new Date(book.meetupDateTime).toLocaleString()
                    : 'TBD'}
                </Text> */}
                <Text  mb={2}>{book.description}</Text>
                
                <Flex pt={5} direction="row" gap={2}>
                  <Flex align="center" height="48px">  
                    <label htmlFor="profile-image-input" >
                      <Avatar
                        size="md"
                        src={profileImage}
                        bg="gray.400"
                        cursor="pointer"
                      />
                    </label>
                  </Flex>

                  <Flex direction="column" justify="center" height="48px">   
                    <Text fontSize="md" mb={1} pt={3.5} lineHeight="1">{book.contactInfo || 'TBD'}</Text>
                    <Text color="gray.600" fontSize="xs" mb={0}>{book.meetupLocation || 'TBD'}</Text>
                    <Text color="gray.600" fontSize="xs" mt={0}>{book.meetupDateTime
                    ? new Date(book.meetupDateTime).toLocaleString()
                    : 'TBD'}</Text>
                  </Flex>   
                </Flex>

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

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentUser } = useAuth();
  // Olivia's working code
  const [books, setBooks] = useState([]);
  // const toast = useToast();
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if more products are available
 
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books
  const [gotOriginalBooks, setGotOriginalBooks] = useState(false); // Track if original books are fetched
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [favIds, setFavIds] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // filter states:
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Track selected department
  const [selectedCatalogNumber, setSelectedCatalogNumber] = useState(""); // Track selected catalog number
  

  // GREAT - OLD
  // Fetch products for the current page
  // const fetchMoreProducts = async () => {
  //   try {
  //     const limit = 10; // Number of products to fetch per page
  //     const response = await fetchProducts(page, limit); // Pass page and limit to the API
  //     if (response.length === 0) {
  //       setHasMore(false); // No more products to load
  //       return [];
  //     }
  //     // Shows products that are NOT this user's in homepage
  //     const filteredProducts = response.filter(
  //       (product) =>
  //         product.userPosted !== currentUser.uid &&
  //         product.status !== "bought" &&
  //         product.status !== "sold" &&
  //         product.status !== "requested"
  //     );
  //     setBooks(filteredProducts); // Append new products to the list

  //     // THIS SOLVES OUR "1st filter doesn't work" problem!!!!
  //     setTimeout(() => {
  //       setFilteredBooks(filteredProducts); // Initialize filteredBooks
  //       setGotOriginalBooks(true); // Ensure this runs only once
  //     }, 500); 
  //     // console.log("filteredBooks TEST INTRO?: ", filteredBooks);
  //     // setPage((prevPage) => prevPage + 1); // Increment the page number

  //     return filteredProducts;
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     return [];
  //   }
  // };

  const fetchMoreProducts = async () => {
    const limit = 30;
    const response = await fetchProducts(page, limit);
    // if (response.length === 0) {
    //   setHasMore(false);
    // }
    if (response.length < limit) {
      setHasMore(false);
    }
    return response;
  };


  // useEffect(() => {
  //   if (currentUser) {
  //     fetchMoreProducts(); // Load the first page of products
  //   }
  //   if (books.length > 0 && !gotOriginalBooks) {
  //     setFilteredBooks(books); // Store the original books
  //     setGotOriginalBooks(true); // Ensure this runs only once
  //     console.log("filteredBooks initialized:", books);
  //   }
  // }, [gotOriginalBooks]);

   // 1) load favorites once
   useEffect(() => {
    if (!currentUser) return;
    fetchUserFavorites(currentUser.uid).then(setFavIds);
  }, [currentUser]);

  // GREAT - OLD CODE
  // useEffect(() => {
  //   if (!currentUser)  return;
    
  //   const load = async () => {
  //     // fetchMoreProducts(); // Load the first page of products
  //     const fetched = await fetchMoreProducts();
  //     setBooks(
  //       fetched.map(b => ({
  //         ...b,
  //         favorite: favIds.includes(b.id)
  //       }))
  //     );

  //     if (fetched.length > 0 && !gotOriginalBooks) {
  //       setFilteredBooks(fetched); // Store the original books
  //       setGotOriginalBooks(true); // Ensure this runs only once
  //       console.log("filteredBooks initialized:", books);
  //     }
      
  //   };
  //   load();
  // }, [currentUser, favIds]);

  useEffect(() => {
    if (!currentUser) return;

    // // reset everything when user changes
    // setBooks([]);
    // setFilteredBooks([]);
    // setGotOriginalBooks(false);

    // reset on first page
    // if (page === 1) {
    //   setBooks([]);
    //   setFilteredBooks([]);
    //   setGotOriginalBooks(false);
    // }

    (async () => {
      // 1) load favorites
      const favs = await fetchUserFavorites(currentUser.uid);

      // 2) fetch all products
      const raw = await fetchMoreProducts();
      console.log("[HomePage] raw products before filter:", raw);

      // 3) filter out sold/bought/requested and your own posts
      const visible = raw.filter(
        p =>
          p.userPosted !== currentUser.uid &&
          !["bought", "sold", "requested"].includes(p.status)
      );
      console.log("[HomePage] visible after filter:", visible);

      // 4) merge in favorites flag
      const withFav = visible.map(p => ({
        ...p,
        favorite: favs.includes(p.id)
      }));

      // // 5) set final state
      // setBooks(withFav);
      // setFilteredBooks(visible);
      // setGotOriginalBooks(true);

      // OLD CODE
      // append on pages > 1
      // setBooks(prev =>
      //   page === 1 ? withFav : [...prev, ...withFav]
      // );

      // NEW: only append items whose id isn't already in prev
      setBooks(prev => {
        if (page === 1) return withFav;
        const newItems = withFav.filter(item =>
          !prev.some(b => b.id === item.id)
        );
        return [...prev, ...newItems];
      });

      // only store original on first page
      if (page === 1) {
        setFilteredBooks(visible);
        setGotOriginalBooks(true);
      }

    })();
  }, [currentUser, page]);



  // Handle search input WORKS NOW!!!!
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);

    if (!gotOriginalBooks) {
      setFilteredBooks(books); // Store the original books before filtering
      setGotOriginalBooks(true); // Set the flag to true after storing original books
    }
  };

  // Handle search on Enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim() === "") {
        // If the search query is empty, reset to show all books
        // console.log("filteredBooks: ", filteredBooks);
        // console.log("books: ", books);
        setBooks(filteredBooks);
      } else {
        // setFilteredBooks(books); // Reset to show all books before filtering
        // Filter books based on the search query
        const filtered = books.filter((book) =>
          book.name?.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setBooks(filtered); // Update the books state with the filtered results
      }
      // setSearchQuery(""); // Clear search bar .. nvmd, its better without...
    }
  };

  const handleApplyFilters = () => {

    // if (!filteredBooks || filteredBooks.length === 0) {
    //   console.log("FilteredBooks is not initialized yet.");
    //   return; // Prevent filtering if filteredBooks is not initialized
    // }

    const filters = {
      subjects: selectedSubjects,
      conditions: selectedConditions,
      department: selectedDepartment,
    };

    console.log("Wave 1");
    // VERY IMPORTANT, makes sure the orignal books are stored (before filering)
    if (!gotOriginalBooks) {
      setFilteredBooks(books);
      setGotOriginalBooks(true);
    }

    // Check if all filters are empty
    const noFiltersSelected =
    !filters.subjects &&
    !filters.conditions &&
    !filters.department;

    console.log("subjects: ", filters.subjects);
    console.log("conditions: ", filters.conditions);
    console.log("department: ", filters.department);
    console.log("noFiltersSelected: ", noFiltersSelected);
    console.log("filteredBooks: ", filteredBooks);
    console.log("Wave 2")
    if (noFiltersSelected) {
      // Reset to filteredBooks if no filters are selected
      setBooks(filteredBooks);
      resetFilters();
      return;
    }

    // console.log("Wave 3")
    const filtered = filteredBooks.filter(book => {
      // subject filter (OR across subjects)
      // console.log("wave 3.1")
      // console.log("selectedSubjects: ", selectedSubjects)
      // console.log("book.subject[0]: ", book.subject[0])
      // console.log("book.subject: ", book.subject)
      if (
        selectedSubjects.length > 0 &&
        !selectedSubjects.includes(book.subject.toLowerCase())
      ) {
        return false;
      }

      // console.log("wave 3.2")
      // console.log("selectedConditions: ", selectedConditions)
      // console.log("book.condition[0]: ", book.condition[0])
      // console.log("book.condition: ", book.condition)
      // condition filter (OR across conditions)
      if (
        selectedConditions.length > 0 &&
        !selectedConditions.includes(book.condition.toLowerCase())
      ) {
        return false;
      }
      // console.log("wave 3.3")
      // department filter
      if (
        selectedDepartment &&
        book.department?.toLowerCase() !== selectedDepartment.toLowerCase()
      ) {
        return false;
      }
      // console.log("wave 3.success!")
      // passed every active filter
      return true;
    });
  
    setBooks(filtered);
    resetFilters();
  };

  const resetFilters = () => {
    setSelectedSubjects([]); // Reset subjects to an empty array
    setSelectedConditions([]); // Reset conditions to an empty array
    setSelectedDepartment(""); // Reset department to an empty string
    setSelectedCatalogNumber(""); // Reset catalog number to an empty string
  };

  const handleToggleFavorite = async bookId => {

    // figure out current value
    const current = books.find(b => b.id === bookId)?.favorite || false
    const nextFav = !current

    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId 
          ? { ...book, favorite: nextFav } 
          : book
      )
    );

    // 2) update your local fav‐id list
    setFavIds(ids =>
      nextFav ? [...ids, bookId] : ids.filter(id => id !== bookId)
    )

    // // Optional: persist to your backend
    // await updateUserFavorite(
    //   currentUser.uid,
    //   bookId,
    //   !books.find(b=>b.id===bookId).favorite
    // );

    // // update favIds so UI stays in sync
    // setFavIds(ids => 
    //   ids.includes(bookId)
    //     ? ids.filter(id=>id!==bookId)
    //     : [...ids, bookId]
    // );

    // 3) persist
    try {
      await updateUserFavorite(currentUser.uid, bookId, nextFav)
    } catch (err) {
      console.error("failed to save fav", err)
      // optional: roll back if you want
    }

  };


  // 2) derive sortedBooks
  const sortedBooks = useMemo(() => {
    switch (sortOption) {
      case 'low':
        return [...books].sort((a, b) => a.price - b.price);
      case 'high':
        return [...books].sort((a, b) => b.price - a.price);
      default:
        return books; // “recent” or any other
    }
  }, [books, sortOption]);


  return (
    <Box bg="white" minHeight="100vh">
    
    <Navbar
      searchQuery={searchQuery}
      handleSearchInput={handleSearchInput}
      handleSearchKeyDown={handleSearchKeyDown}
      onOpenFilters={onOpen}
    />

    <Banner />
    <Flex direction="column" p={4}>
      {/* Filter and Sort Buttons */}
      <Flex gap={3} mb={1} alignItems="right" justifyContent="right">
        <Button
        
          rightIcon={<FiFilter/>}
          onClick={onOpen}
          backgroundColor={'rgb(195, 195, 195)'}
        >
          Filters
        </Button>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} backgroundColor={'rgb(195, 195, 195)'}>
            Sort
          </MenuButton>
          <MenuList>
          <MenuOptionGroup defaultValue={sortOption} title="Sort by" type="radio" onChange={setSortOption}>
              <MenuItemOption value="low">Price: low to high</MenuItemOption>
              <MenuItemOption value="high">Price: high to low</MenuItemOption>
              <MenuItemOption value="recent">Recently Listed</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Flex>

      
    </Flex>
    <Flex>
    <SideSearchTab
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      selectedSubjects={selectedSubjects}
      setSelectedSubjects={setSelectedSubjects}
      selectedConditions={selectedConditions}
      setSelectedConditions={setSelectedConditions}
      selectedDepartment={selectedDepartment}
      setSelectedDepartment={setSelectedDepartment}
      selectedCatalogNumber={selectedCatalogNumber}
      setSelectedCatalogNumber={setSelectedCatalogNumber}
      onApplyFilters={(filters) => {
        handleApplyFilters(filters);
        onClose(); // Close the sidebar after applying filters
        // setIsSidebarOpen(false); // also close it after applying filters
      }}
    />

      <Box p={4} bg="white" minHeight="100vh">
      <Box w={{ base: "100%", md: "95%" }} mx="auto">
        <Grid 
          templateColumns={{
            base: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)', 
            xl: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          {sortedBooks.length > 0 ? sortedBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onToggleFavorite={handleToggleFavorite} 
              currentUser={currentUser}
              onRequestMade={(bookId) =>
                setBooks(prevBooks => 
                  prevBooks.map(b => 
                    b.id === bookId 
                      ? { ...b,
                        status: "requested",
                        usersRequested: [...b.usersRequested, currentUser.uid]
                      } 
                      : b
                  )
                )
              }
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

        {/* 3) Load more button */}
        {/* {hasMore && (
          <Box textAlign="center" my={6}>
            <Button
              onClick={() => setPage(p => p + 1)}
              isLoading={!gotOriginalBooks}
            >
              Load more
            </Button>
          </Box>
        )} */}
        {hasMore ? (
          <Box textAlign="center" my={6}>
            <Button
              onClick={() => setPage(p => p + 1)}
              isLoading={!gotOriginalBooks}
            >
              Load more
            </Button>
          </Box>
        ) : (
          <Text textAlign="center" my={6} color="gray.500">
            No more books to load.
          </Text>
        )}

        </Box>
      </Box>
    </Flex>
    </Box>
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
