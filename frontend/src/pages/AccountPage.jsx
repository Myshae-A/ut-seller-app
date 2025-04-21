import React, { useState, useEffect, useRef, useMemo } from 'react';
// import american from '../images/american.jpg';
// import linear from '../images/linear.jpg';
import Navbar from '../components/Navbar'
import { FiFlag } from 'react-icons/fi';
import { useClipboard } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Box,
  Container,
  Flex,
  Text,
  Textarea,
  Image,
  VStack,
  Input,
  Icon,
  Avatar,
  IconButton,
  Button,
  Link,
  Tabs,
  Select,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Badge,
  Modal, 
  Divider,
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  useDisclosure,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  fetchProducts,
  fetchProductById,
  fetchUserProducts,
  getUserNameFromID,
  updateBookSoldByToOther,
  updateUserFavorite,
  fetchUserFavorites,
} from '../services/api'; // 
import { uploadProfileImage } from "../services/uploadProfileImage";
import { updateUserProfile } from "../services/api";
import confetti from 'canvas-confetti';

// individual book cards 
//need to change modal to be differnt from home page modal. !!!
const BookCard = ({
  book,
  onToggleFavorite,
  postedNotifications,
  handleSellingTo,
  handleFinalizeSell,
  selectedUserId,
  setSelectedUserId,
  globalNameMap  }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showReportOverlay, setShowReportOverlay] = useState(false);

  const tags = [
    ...(book.subject ? [book.subject] : []),
    ...(book.condition ? [book.condition] : []),
    ...(book.department ? [book.department] : []),
  ];
  // Need a smaller number than 23 as it previously was
  const maxTotalLength = 12; 
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

  const [showSharePopup, setShowSharePopup] = useState(false);
  const shareUrl = `https://yourapp.com/listings/${book.id}`; // replace with actual URL
  const { hasCopied, onCopy } = useClipboard(shareUrl);
  const toast = useToast();

  const [imgIndex, setImgIndex] = useState(0);
  const images = [ book.image, ...(book.additionalImages||[]) ];
  const closeBtnRef = useRef(null);
  
  const handleNextImage = () => {
    setImgIndex(i => (i + 1) % images.length);
  };
  const handlePrevImage = () => {
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  // const userRequestedNames = useMemo(() => {
  //   return book.usersRequested.map((id) => ({
  //     id,
  //     name: getUserNameFromID(id) || "blank",
  //   }));
  // }, [book.usersRequested]);


  // const [requesterNames, setRequesterNames] = useState([])
  

  // useEffect(() => {
  //   if (!book.usersRequested?.length) return
  
  //   setTimeout(() => {
  //     async function loadNames() {
  //       // map each UID → promise that resolves to a displayName
  //       const names = await Promise.all(
  //         book.usersRequested.map((uid) => getUserNameFromID(uid))
  //       )
  //       setRequesterNames(names)
  //     }
  //     loadNames()
  //   }, 1000)
    
  // }, [book.usersRequested])

  // const fetchedRef = useRef(false)
  // useEffect(() => {
  //   if (!isOpen) return                 // do nothing until user opens the modal
  //   if (fetchedRef.current) return      // already fetched once
  //   if (!book.usersRequested?.length) return

  //   fetchedRef.current = true

  //   async () => {
  //     try {
  //       const names = await Promise.all(
  //         book.usersRequested.map((uid) => getUserNameFromID(uid))
  //       )
  //       setRequesterNames(names)
  //     } catch (err) {
  //       console.error("Failed to load names", err)
  //     }
  //   }
  // }, [isOpen, book.usersRequested])

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
        position="relative"
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
            alt={book.name}
            objectFit="cover"
            width="full"
            height="full"
          />

          {/* Overlay for Sold Products */}
          {book.status === "sold" && (
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
            zIndex={1}                     // above the image
          >
            {/* solid pill behind the text */}
            <Box
              bg="orange.600"
              px={20}
              borderRadius="md"
            >
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="white"             // darker blue text
              textAlign="center"
              lineHeight=".1"
              marginTop={3}
            >
              SOLD
            </Text>
            </Box>
          </Box>
          )}

          {/* Overlay for Sold Products */}
          {book.status === "bought" && (
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
            zIndex={1}                     // above the image
          >
            {/* solid pill behind the text */}
            <Box
              bg="green.600"
              px={20}
              borderRadius="md"
            >
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="white"             // darker blue text
              textAlign="center"
              lineHeight=".1"
              marginTop={3}
            >
              BOUGHT
            </Text>
            </Box>
          </Box>
          )}

          {/* Overlay for Requested Products */}
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
              zIndex={1}                     // above the image
            >
              {/* solid pill behind the text */}
              <Box
                bg="blue.600"
                px={10}
                borderRadius="md"
              >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white"             // darker blue text
                textAlign="center"
                lineHeight=".1"
                marginTop={3}
              >
                REQUESTED
              </Text>
              </Box>
            </Box>
          )}

          {/* Red Dot for Notifications */}
          {postedNotifications !== undefined &&  // Check if postedNotifications is defined
          postedNotifications[book.id] && (
            <Box
              position="absolute"
              top="4px"
              right="4px"
              bg="red.500"
              color="white"
              borderRadius="full"
              width="28px"
              height="28px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="bold"
              border="2px solid black"
            >
              {postedNotifications[book.id]} {/* Display the count */}
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
        
        <Box p={3} position="relative">
          <Text 
            fontWeight="bold" 
            fontSize="sm" 
            noOfLines={1} 
            mb={2}
          >
            {book.name}
          </Text>
          
          <Flex gap={1} mb={2} flexWrap="wrap">
            {visibleTags.map((tag, idx) => {
              let bgColor = "gray.300";               // fallback
              if (tag === book.subject) {
                bgColor = "rgba(200,226,240,1)";
              } else if (tag === book.condition) {
                bgColor = "rgba(221,147,51,0.47)";
              } else if (tag === book.department) {
                bgColor = "rgba(231,185,216,1)";
              }
              return (
                <Badge
                  key={idx}
                  bgColor={bgColor}
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
            color="gray.700"
          >
            ${book.price}
          </Text>
        </Box>
      </Box>

      <Modal
        initialFocusRef={closeBtnRef}
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
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
            w={{ base: '60%', md: '60%', sm: '50%' }} 
            borderRadius="md"
            pb={4}
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
            <ModalCloseButton ref={closeBtnRef} />
            <ModalBody>
              <Flex
                flexDirection="column"
                //justifyContent="space-between"
                h="100%">
              <Text fontSize="xl" mb={2}>{book.name}</Text>
                
              <Text fontWeight="bold" mb={2}>Price: ${book.price}</Text>

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
                
                  {/* Displays Book Status*/}
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    bg="gray.300"
                    borderRadius={30}
                    p={2}
                    textAlign="center"
                  >
                    {book.status ? book.status.charAt(0).toUpperCase() + book.status.slice(1) : "No Status"}
                  </Text>

                  {/* Confirm Sell Button */}
                  {book.status === 'posted' && book.usersRequested && book.usersRequested.length > 0 && (
                    <Box
                      mt={4}
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log("HERE CLICKing sell")
                      }}
                    >
                      <Text fontWeight="bold" fontSize="sm" mb={2}>
                        Confirm Sell?
                      </Text>
                      <Select
                        placeholder="Select a user"
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        bg="gray.100"
                        borderRadius={10}
                        mb={2}
                      >
                        {book.usersRequested.map((uid) => (
                          <option key={uid} value={uid}>
                            {globalNameMap[uid] || "Loading..."}
                          </option>
                        ))}
                      </Select>
                      <Button
                        size="sm"
                        colorScheme="orange"
                        onClick={() => handleFinalizeSell(book.id, selectedUserId)}
                        isDisabled={!selectedUserId}
                      >
                        Confirm
                      </Button>
                    </Box>
                  )}
                </Box>

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
                <Text mb={2}>
                  Meetup Date:{' '}
                  {book.meetupDateTime
                    ? new Date(book.meetupDateTime).toLocaleString()
                    : 'TBD'}
                </Text>
                <Text mb={2}>
                  Location: {book.meetupLocation || 'TBD'}
                </Text>
                <Text mb={2}>
                  Contact: {book.contactInfo || 'TBD'}
                </Text>
                <Text  mb={2}>Description: {book.description}</Text>

              </Flex>
            </ModalBody>
            </Box>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

const AccountPage = () => { // STOPPED HERE, trying to login login as YOURSELF
    // const [books, setBooks] = useState(sampleBooks);
    
    const [books, setBooks] = useState([]); // Initialize books state
    const [requestedBooks, setRequestedBooks] = useState([]);
    const [boughtBooks, setBoughtBooks] = useState([]);
    const [soldBooks, setSoldBooks] = useState([]);
    const [postedBooks, setPostedBooks] = useState([]);


    // newer variables
    const [postedNotifications, setPostedNotifications] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(""); // currentUser?.profileImage || 
    const [globalNameMap, setGlobalNameMap] = useState({})

    const navigate = useNavigate();
    const { currentUser, authBooksRequested } = useAuth();
    const toast = useToast();
    const [favIds, setFavIds] = useState([])

    // const [savedBooks, setSavedBooks] = useState([]);
    // derive savedBooks directly:
    const savedBooks = useMemo(
      () => books.filter(b => favIds.includes(b.id)),
      [books, favIds]
    );
    // const [triggerName, setTriggerName] = useState();



      // load saved books whenever the user changes
  // useEffect(() => {
  //   if (!currentUser) return;
  //   (async () => {
  //     const favIds = await fetchUserFavorites(currentUser.uid);
  //     const proms = favIds.map(id =>
  //       fetchProductById(id).then(res => res.product || res)
  //     );
  //     const prods = await Promise.all(proms);
  //     setSavedBooks(prods);
  //   })();
  // }, [currentUser]);


    // LATELY REMOVED
    //  // 1) load favorites‐ids on login
    // useEffect(() => {
    //   if (!currentUser) return
    //   fetchUserFavorites(currentUser.uid).then(setFavIds)
    // }, [currentUser])

    // 2) whenever favIds change, fetch each product & mark favorite=true
    // PREVIOUSLY USED CODE:
    // useEffect(() => {
    //   if (favIds.length === 0) {
    //     setSavedBooks([])
    //     return
    //   }
    //   (async () => {
    //     const proms = favIds.map(id =>
    //       fetchProductById(id).then(res => {
    //         // grab the real product object
    //         const data = res.product ?? res
    //         return { ...data, favorite: true }
    //       })
    //     )
    //     const prods = await Promise.all(proms)
    //     // stamp each one
    //     // setSavedBooks(
    //     //   prods.map(p => ({ ...p, favorite: favIds.includes(p.id) }))
    //     // )
    //     setSavedBooks(prods)
    //   })()
    // }, [favIds])

    // 3) tweak your toggle handler to update favIds
    const handleToggleFavorite = async bookId => {
      const nextFav = !favIds.includes(bookId)
      // optimistic UI
      setFavIds(ids =>
        nextFav ? [...ids, bookId] : ids.filter(id => id !== bookId)
      )
      try {
        await updateUserFavorite(currentUser.uid, bookId, nextFav)
      } catch (err) {
        console.error(err)
      }
    }


    // REPLACEMENT CODE:
    useEffect(() => {
      if (!currentUser) return
    
      (async () => {
        try {
          // 1) load both favorites & user’s products in parallel
          const [ids, products] = await Promise.all([
            fetchUserFavorites(currentUser.uid),
            fetchUserProducts(currentUser.uid),
          ])
    
          // 2) store raw favIds for Saved tab & toggle logic
          setFavIds(ids)
    
          // 3) “stamp” every product with favorite=true/false
          const stamped = products.map(book => ({
            ...book,
            favorite: ids.includes(book.id),
          }))
    
          // 4) populate each per‑tab list
          setBooks(stamped)
          setBoughtBooks(stamped.filter(b => b.status === 'bought'))
          setSoldBooks(  stamped.filter(b => b.status === 'sold'))
          setPostedBooks(stamped.filter(b => b.status === 'posted'))
          setRequestedBooks(
            stamped.filter(b => b.status === 'requested')
          )
          // (savedBooks is driven by favIds → fetchProductById effect)
        } catch (err) {
          console.error('Error loading account data', err)
        }
      })()
    }, [currentUser])

    useEffect(() => {
      const tag = list => list.map(b => ({ ...b, favorite: favIds.includes(b.id) }))
      setBooks(prev => tag(prev))
      setBoughtBooks(prev => tag(prev))
      setSoldBooks(prev => tag(prev))
      setPostedBooks(prev => tag(prev))
      setRequestedBooks(prev => tag(prev))
      // savedBooks is already driven by favIds→fetchProductById
    }, [favIds])


    // LATELY REMOVED
    // 3bis) whenever favIds change, re‐tag every tab’s books
    // useEffect(() => {
    //   const tag = list => list.map(b => ({ ...b, favorite: favIds.includes(b.id) }));
    //   setBooks(prev => tag(prev));
    //   setBoughtBooks(prev => tag(prev));
    //   setSoldBooks(prev => tag(prev));
    //   setPostedBooks(prev => tag(prev));
    //   setRequestedBooks(prev => tag(prev));
    //   // savedBooks is already tagged in your other effect
    // }, [favIds]);



    // OLD FAVORITE CODE:
    // // whenever `books` changes, rebuild savedBooks
    // useEffect(() => {
    //   setSavedBooks(books.filter(b => b.favorite));
    // }, [books]);

    // // Function to toggle favorite status
    // const handleToggleFavorite = async bookId => {

    //   const current = books.find(b => b.id === bookId)?.favorite || false
    //   const nextFav = !current

    //   setBooks((prevBooks) =>
    //     prevBooks.map((book) =>
    //       book.id === bookId
    //         ? { ...book, favorite: nextFav }
    //         : book
    //     )
    //   );

    //   // Optional: persist to your backend
    //   // await updateUserFavorite(currentUser.uid, bookId, !books.find(b=>b.id===bookId).favorite);
    //   try {
    //     await updateUserFavorite(currentUser.uid, bookId, nextFav)
    //   } catch (err) {
    //     console.error("failed to save fav", err)
    //   }
    // };

    // useEffect(() => {
    //   if (currentUser) {
    //     console.log("Current User updated:", currentUser.displayName);
    //     setTriggerName(currentUser.displayName); // Increment trigger to force re-render
    //   }
      
    // }, [currentUser]);


    // const boughtBooks = books.filter(book => book.status === 'bought');
    // const soldBooks = books.filter(book => book.status === 'sold');
    // const postedBooks = books.filter(book => book.status === 'posted');
    // const requestedBooks = books.filter(book => book.status === 'requested');
    // const requestedBooks = [];
    // const savedBooks = books.filter(book => book.status === 'saved');

    // OHHH the problem is the name specifically has to be "currentUser", not just "user" !!!
    const handleProfileImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        // setIsUploading(true);
  
        // Upload the profile image to Firebase Storage
        const imageUrl = await uploadProfileImage(file, currentUser.uid);
  
        // console.log("Uploaded image URL:", imageUrl);
        // Update the user's profile in Firestore
        await updateUserProfile(currentUser.uid, imageUrl);
  
        // Update the local state
        setProfileImage(imageUrl);
  
        toast({
          title: "Success",
          description: "Profile image updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast({
          title: "Error",
          description: "Failed to update profile image. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    // LATEST OLD CODE
    // // Fetch books from the backend when the component mounts
    // useEffect(() => {

    //   // console.log("Current user:", currentUser);
      
    //   const fetchBooks = async () => {
    //     try {

    //       if (!currentUser) {
    //         console.error("User is not defined");
    //         return;
    //       }

    //       const data = await fetchUserProducts(currentUser.uid); // Adjust the URL as needed
          
    //       // ← stamp in favorite flag
    //       const stamped = data.map(b => ({
    //         ...b,
    //         favorite: favIds.includes(b.id)
    //       }));

    //       // set each tab’s list from the stamped array
    //       setBooks(stamped);
    //       setRequestedBooks(stamped.filter(b => b.status === 'requested'));
    //       setPostedBooks   (stamped.filter(b => b.status === 'posted'));
    //       setBoughtBooks   (stamped.filter(b => b.status === 'bought'));
    //       setSoldBooks     (stamped.filter(b => b.status === 'sold'));

    //       // const list = [];
    //       // for (let i = 0; i < data.length; i++) {
    //       //   list.push(data[i]); // Add each requested book to the array
    //       // }
    //       // setBooks(list); // Set the fetched books to state

    //       // const requestList = [];
    //       // for (let i = 0; i < data.length; i++) {
    //       //   if (data[i].status === 'requested') {
    //       //     requestList.push(data[i]);
    //       //   }
    //       // }
    //       // setRequestedBooks(requestList);

    //       // const postedList = [];
    //       // for (let i = 0; i < data.length; i++) {
    //       //   if (data[i].status === 'posted') {
    //       //     postedList.push(data[i]);
    //       //   }
    //       // }
    //       // setPostedBooks(postedList);

    //       // const boughtList = [];
    //       // for (let i = 0; i < data.length; i++) {
    //       //   if (data[i].status === 'bought') {
    //       //     boughtList.push(data[i]);
    //       //   }
    //       // }
    //       // setBoughtBooks(boughtList);

    //       // const soldList = [];
    //       // for (let i = 0; i < data.length; i++) {
    //       //   if (data[i].status === 'sold') {
    //       //     soldList.push(data[i]);
    //       //   }
    //       // }
    //       // setSoldBooks(soldList);

    //       // const savedList = [];
    //       // for (let i = 0; i < data.length; i++) {
    //       //   if (data[i].status === 'saved') {
    //       //     savedList.push(data[i]);
    //       //   }
    //       // }
    //       // setSavedBooks(savedList);

    //     } catch (error) {
    //       console.error('Error fetching books:', error);
    //     }
    //   };
    //   fetchBooks();
      

    // }, []);

    
  //   const generateRequestedBooks = async () => {
  //     // onClick={() => generateRequestedBooks()}
  //     const list = [];
  //     console.log("authBooksRequested: ", authBooksRequested);
  //     console.log("requestedBooks: ", requestedBooks);
  //     for (let i = 0; i < authBooksRequested.length; i++) {
  //       try {
  //         console.log("authBooksRequested[i].id: ", authBooksRequested[i].id);
  //         const book = await fetchProductById(authBooksRequested[i].id); // Fetch each book by ID
  //         list.push(book);
  //         console.log("GENERATE REQUEST BOOKS: ", book);
  //       } catch (error) {
  //         console.error('Error fetching requested book:', error);
  //       }
  //     }
  // }

    useEffect(() => {
      if (postedBooks.length > 0) {
        checkPostedNotifications(); // Run only when postedBooks is updated
      }
    }, [postedBooks]);

  //   useEffect(() => { // ensures the products still load after
  //     const loadBooks = async () => {
  //         try {
  //             // Check if products are already saved in localStorage
  //             const savedBooks = localStorage.getItem('books');
  //             if (savedBooks) {
  //                 setBooks(JSON.parse(savedBooks)); // Load books from localStorage
  //                 return;
  //             }

  //             // Fetch products from the backend
  //             if (!currentUser) {
  //                 console.error("User is not defined");
  //                 return;
  //             }

  //             const data = await fetchProducts();
  //             const userBooks = data.filter((product) => product.userPosted === currentUser.uid);
  //             setBooks(userBooks);

  //             // Save fetched books to localStorage
  //             localStorage.setItem('books', JSON.stringify(userBooks));
  //         } catch (error) {
  //             console.error('Error fetching books:', error);
  //         }
  //     };

  //     loadBooks();
  // }, [currentUser]);
  

    const checkPostedNotifications = async () => {
      const postedNotificationsList = {};

      postedBooks.forEach((book) => {
        if (book.usersRequested && book.usersRequested.length > 0) {
          postedNotificationsList[book.id] = book.usersRequested.length; // Store the count of requests for each book
        }
      });

      console.log("FORMAT for postedNoficiationsList: ", postedNotificationsList);
      setPostedNotifications(postedNotificationsList);
      console.log("books posted w notifications: "+postedNotificationsList.length)
    };


    const sellingTo = async (bookId, userId) => {
      console.log("Selling to user ID: ", userId);
      console.log("Selling book ID: ", bookId);
      
    }

    const finalizeSell = async (bookId, userId) => {
      try {
        // Log the selected book and user
        console.log(`Confirming sale for Book ID: ${bookId}, User ID: ${userId}`);
        
        // setBoughtBooks((prevBoughtBooks) => {
        const bookToAdd = books.find((book) => book.id === bookId);
        setSoldBooks((prevSoldBooks) => [
          ...prevSoldBooks,
          { ...bookToAdd, status: "sold", soldTo: userId }, // Update status and add soldTo field
        ]);

        // console.log("Sold By This user: ", currentUser.uid);
        // console.log("Book being sold: ", bookId);
        // console.log("User being sold to: ", userId);

        // does all the work in the backend!!! VERY IMPORTANT!!!
        await updateBookSoldByToOther(currentUser.uid, bookId, userId);

        // currently doing these in frontend, but need to do it in BACKEND TOO!
        // Update the book's status in the state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId
              ? { ...book, status: "sold", soldTo: userId } // Update status and add soldTo field
              : book
          )
        );
    
        setPostedBooks((prevPostedBooks) =>
          prevPostedBooks.filter((book) => book.id !== bookId) // Remove the book from postedBooks
        );

        // fire confetti!
        const count = 200;
        const defaults = { origin: { y: 0.7 } };
        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            zIndex: 9999,
            particleCount: Math.floor(count * particleRatio)
          });
        }
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2,  { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1,  { spread: 120, startVelocity: 45 });

        // optional: give user a toast
        // toast({
        //   title: "Success!",
        //   description: "Sold! 🎉",
        //   status: "success",
        //   duration: 3000,
        //   isClosable: true,
        //   position: "top",
        // });

        console.log("Sale confirmed successfully!");
      } catch (error) {
        console.error("Error confirming sale:", error);
      }
    };



    useEffect(() => {
      if (!postedBooks.length) return
      (async () => {
        // flatten all UIDs
        const allUids = Array.from(new Set(
          postedBooks.flatMap(b => b.usersRequested || []
        )))

        const names = await Promise.all(allUids.map(uid => getUserNameFromID(uid)))
        const map = Object.fromEntries(allUids.map((uid, i) => [uid, names[i]]))
        setGlobalNameMap(map)
      })()
    }, [postedBooks])


    // // Function to handle logout
    // const handleLogout = async () => {
    //   try {
    //     await logout(); // Call the logout function
    //     navigate('/login'); // Redirect to the login page
    //   } catch (error) {
    //     console.error('Error logging out:', error);
    //   }
    // };
  
    return (  
        <Box bg="white" minH="100vh">
            <Navbar />
                {/* Profile Section */}
                <Container maxWidth="60%" pt="6" pb="4">

                    <Flex direction="row" align="center" gap={8} justify="flex-start">
                        <Box>
                          <label htmlFor="profile-image-input" >
                            <Avatar
                            size="2xl"
                            src={profileImage}
                            bg="gray.200"
                            mb="4"
                            cursor="pointer"
                            />
                          </label>

                          <Input
                            id="profile-image-input"
                            type="file"
                            accept="image/*"
                            display="none" // Hides the input
                            onChange={handleProfileImageChange}
                          />
                        </Box>
                    
                        <Box>
                            <Text fontSize="xl">{currentUser?.displayName || (currentUser?.email ? currentUser.email.split("@")[0] : "User")}</Text>
                            <Text color="gray.600" fontSize="md">{currentUser?.email || "No email available"}</Text>
                        </Box>
                        
                    </Flex>
                    
                </Container>

                {/* Tabs Section */}
                <Box>
                <Container maxW="container.lg" p="0">
                    <Tabs variant="line" colorScheme="orange" isFitted>
                    <TabList>
                        <Tab>All</Tab>
                        <Tab>Bought</Tab>
                        <Tab>Sold</Tab>
                        <Tab>Posted</Tab>
                        <Tab>Requested</Tab>
                        <Tab>Saved</Tab>
                    </TabList>
        
                    <TabPanels>
                        {/* All Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {books.length > 0 ? books.map((book) => (
                            <BookCard 
                              key={book.id}
                              book={book}
                              onToggleFavorite={handleToggleFavorite}
                              postedNotifications={postedNotifications}
                              handleSellingTo={sellingTo}
                              handleFinalizeSell={finalizeSell}
                              selectedUserId={selectedUserId}
                              setSelectedUserId={setSelectedUserId}
                              globalNameMap={globalNameMap}
                            />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No items to display</Text>
                          }
                        </SimpleGrid>
                        </TabPanel>

                        {/* Bought Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {boughtBooks.length > 0 ?
                            boughtBooks.map((book) => (
                              <BookCard 
                                key={book.id}
                                book={book}
                                onToggleFavorite={handleToggleFavorite}
                                postedNotifications={postedNotifications}
                                handleSellingTo={sellingTo}
                                handleFinalizeSell={finalizeSell}
                                selectedUserId={selectedUserId}
                                setSelectedUserId={setSelectedUserId}
                                globalNameMap={globalNameMap}
                              />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No bought items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>
        
                        {/* Sold Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {soldBooks.length > 0 ? 
                            soldBooks.map((book) => (
                                <BookCard 
                                  key={book.id}
                                  book={book}
                                  onToggleFavorite={handleToggleFavorite}
                                  postedNotifications={postedNotifications}
                                  handleSellingTo={sellingTo}
                                  handleFinalizeSell={finalizeSell}
                                  selectedUserId={selectedUserId}
                                  setSelectedUserId={setSelectedUserId}
                                  globalNameMap={globalNameMap}
                                />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No sold items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>

                        {/* Posted Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {postedBooks.length > 0 ?
                            postedBooks.map((book) => (
                                <BookCard
                                  key={book.id}
                                  book={book}
                                  onToggleFavorite={handleToggleFavorite}
                                  postedNotifications={postedNotifications}
                                  handleSellingTo={sellingTo}
                                  handleFinalizeSell={finalizeSell}
                                  selectedUserId={selectedUserId}
                                  setSelectedUserId={setSelectedUserId}
                                  globalNameMap={globalNameMap}
                                />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No posted items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>

                        {/* Requested Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {requestedBooks.length > 0 ?
                            requestedBooks.map((book) => (
                              <BookCard 
                                key={book.id}
                                book={book}
                                onToggleFavorite={handleToggleFavorite}
                                postedNotifications={postedNotifications}
                                handleSellingTo={sellingTo}
                                handleFinalizeSell={finalizeSell}
                                selectedUserId={selectedUserId}
                                setSelectedUserId={setSelectedUserId}
                                globalNameMap={globalNameMap}
                              />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No requested items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>                        
        
                        {/* Saved Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {savedBooks.length > 0 ? 
                            savedBooks.map((book) => (
                              <BookCard 
                                key={book.id}
                                book={book}
                                onToggleFavorite={handleToggleFavorite}
                                postedNotifications={postedNotifications}
                                handleSellingTo={sellingTo}
                                handleFinalizeSell={finalizeSell}
                                selectedUserId={selectedUserId}
                                setSelectedUserId={setSelectedUserId}
                                globalNameMap={globalNameMap}
                              />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="200%">No saved items to display.</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>

                    </TabPanels>
                    </Tabs>
                </Container>
                </Box>
        </Box>
    );
  };
  
  export default AccountPage;