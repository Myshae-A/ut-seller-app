import React, { useState } from 'react';
import american from '../images/american.jpg';
import linear from '../images/linear.jpg';
import Navbar from '../components/Navbar'
import {
  Box,
  Container,
  Flex,
  Text,
  Image,
  Icon,
  Avatar,
  IconButton,
  Button,
  Link,
  Tabs,
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
  useDisclosure 
} from '@chakra-ui/react';
import { AddIcon, StarIcon } from '@chakra-ui/icons';

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: 'American Art and Culture: Revised First Edition by Craven',
    image: american,
    price: '$27.50',
    condition: 'like new',
    category: ['history', 'visual and performing arts'],
    catalogue: 'M 340L',
    description: 'Few markings and highlighting. Explores the history of art from prehistoric times to the early modern era, covering diverse cultures and artistic movements.',
    status: 'selling',
  },
  {
    id: 2,
    title: 'Linear Algebra & Its Applications 5E',
    image: linear,
    price: '$60.00',
    condition: 'gently used',
    category: ['math'],
    catalogue: 'M 340L',
    description: 'Few markings and highlighting. Explores the history of art from prehistoric times to the early modern era, covering diverse cultures and artistic movements.',
    status: 'selling',
  },
  {
    id: 3,
    title: 'Linear Algebra Done Right (Undergraduate - Hardcover, by Axler',
    image: american,
    price: '$59.20',
    condition: 'brand new',
    category: ['math'],
    catalogue: 'M 340L',
    description: 'Few markings and highlighting. Explores the history of art from prehistoric times to the early modern era, covering diverse cultures and artistic movements.',
    status: 'selling',
  },
  {
    id: 4,
    title: "Gardner's Art through the Ages: A Global History - Hardcover",
    image: linear,
    price: '$64.99',
    condition: 'like new',
    category: ['visual and performing arts', 'history'],
    catalogue: 'M 340L',
    description: 'Few markings and highlighting. Explores the history of art from prehistoric times to the early modern era, covering diverse cultures and artistic movements.',
    status: 'selling',
  },
  {
    id: 5,
    title: 'Diagnostic and Statistical Manual of Mental Disorders',
    image: american,
    price: '$70.99',
    condition: 'like new',
    category: ['math', 'science'],
    catalogue: 'M 340L',
    description: 'Few markings and highlighting. Explores the history of art from prehistoric times to the early modern era, covering diverse cultures and artistic movements.',
    status: 'selling',
  },
];

// individual book cards 
//need to change modal to be differnt from home page modal. !!!
const BookCard = ({ book, onToggleFavorite }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            {book.title}
          </Text>
          
          <Flex gap={2} mb={2} flexWrap="wrap">
            {book.categories && book.categories.map((cat, idx) => (
              <Badge 
                key={idx} 
                bgColor="rgba(221, 147, 51, 0.47)"
                borderRadius={30}
                p={1}
                px={2}
                fontSize="x-small"
                fontWeight="semibold"
              >
                {cat}
              </Badge>
            ))}
            
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

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" >
        <ModalOverlay />
        <ModalContent 
          borderRadius={15} 
          border="2px solid"
          borderColor="gray.600"
          bgColor="rgb(226, 225, 225)"
          p={5}
        >
          <Flex direction={{ base: 'row' }} p={5}>
            <Box 
              w={{ base: '40%'}} 
              borderRadius="md"
              pb={4}
              position="relative"
            >
              <Image 
                  src={book.image}
                  alt={book.title}
                  objectFit="cover"
                  width="200px"
                  height="300px"
                  borderRadius="10px"
                  mr={4}
                />
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
            <ModalCloseButton />
            <ModalBody>
              <Flex
                flexDirection="column"
                //justifyContent="space-between"
                h="100%">
              <Text fontSize="xl" mb={2}>{book.title}</Text>
                
              <Text fontWeight="bold" mb={2}>Price: {book.price}</Text>

                <Box>
                  <Flex gap={2} mb={2} flexWrap="wrap">
                    {book.categories && book.categories.map((cat, idx) => (
                      <Badge 
                        key={idx} 
                        bgColor="rgba(221, 147, 51, 0.47)"
                        borderRadius={30}
                        p={1}
                        px={2}
                        fontSize="x-small"
                        fontWeight="semibold"
                      >
                        {cat}
                      </Badge>
                    ))}
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
                  </Flex>
                </Box>
                <Button
                  bgColor={"rgb(221, 147, 51)"}
                  borderRadius={20}
                >
                  {/*no link functionality yet*/}
                  <Link to={`/account`} style={{ fontWeight:'lighter' }}>
                    Make an Offer
                  </Link>
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
                    <IconButton
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
                    />
                   <Button
                      bgColor="rgba(221, 147, 51, 0.47)"
                      borderRadius={20}
                      p={1}
                      px={5}
                      fontSize="sm"
                      fontWeight="semibold"
                    >...</Button>
                  </Flex>
                </Box>
                    
                <Text  mb={2}>{book.catalogue}</Text>
                <Text  mb={2}>{book.description}</Text>

              </Flex>
            </ModalBody>
            </Box>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

const AccountPage = () => {
    const [books, setBooks] = useState(sampleBooks);
  
    // Function to toggle favorite status
    const handleToggleFavorite = (bookId) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId
            ? { ...book, favorite: !book.favorite, status: !book.favorite ? 'saved' : 'selling' }
            : book
        )
      );
    };
  
    const sellingBooks = books.filter(book => book.status === 'selling');
    const soldBooks = books.filter(book => book.status === 'sold');
    const savedBooks = books.filter(book => book.status === 'saved');
  
    return (  
        <Box bg="white">
            <Navbar />
                {/* Profile Section */}
                <Container maxWidth="60%" pt="6" pb="4" >
                    <Flex direction="row" align="center" gap={8} justify="flex-start">
                        <Box>
                            <Avatar size="2xl" bg="gray.200" mb="4" />
                        </Box>
                    
                        <Box>
                            <Text fontSize="xl">Bevo Longhorn</Text>
                            <Text color="gray.600" fontSize="md">BevoLonghorn@utexas.edu</Text>
                        </Box>
                    </Flex>
                </Container>

                {/* Tabs Section */}
                <Box>
                <Container maxW="container.lg" p="0">
                    <Tabs variant="line" colorScheme="orange" isFitted>
                    <TabList>
                        <Tab>All</Tab>
                        <Tab>Selling</Tab>
                        <Tab>Sold</Tab>
                        <Tab>Saved</Tab>
                    </TabList>
        
                    <TabPanels>
                        {/* All Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {books.map((book) => (
                            <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))}
                        </SimpleGrid>
                        </TabPanel>
        
                        {/* Selling Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {sellingBooks.map((book) => (
                            <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))}
                        </SimpleGrid>
                        </TabPanel>
        
                        {/* Sold Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {soldBooks.length > 0 ? 
                            soldBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="100%">No sold items to display</Text>
                            }
                        </SimpleGrid>
                        </TabPanel>
        
                        {/* Saved Tab */}
                        <TabPanel>
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="4">
                            {savedBooks.length > 0 ? 
                            savedBooks.map((book) => (
                                <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} />
                            ))
                            :
                            <Text textAlign="center" color="gray.500" width="100%">No saved items to display</Text>
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