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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  Heading,
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
    status: 'selling',
  },
  {
    id: 2,
    title: 'Linear Algebra & Its Applications 5E',
    image: linear,
    price: '$60.00',
    condition: 'gently used',
    category: ['math'],
    status: 'selling',
  },
  {
    id: 3,
    title: 'Linear Algebra Done Right (Undergraduate - Hardcover, by Axler',
    image: american,
    price: '$59.20',
    condition: 'brand new',
    category: ['math'],
    status: 'selling',
  },
  {
    id: 4,
    title: "Gardner's Art through the Ages: A Global History - Hardcover",
    image: linear,
    price: '$64.99',
    condition: 'like new',
    category: ['visual and performing arts', 'history'],
    status: 'selling',
  },
  {
    id: 5,
    title: 'Diagnostic and Statistical Manual of Mental Disorders',
    image: american,
    price: '$70.99',
    condition: 'like new',
    category: ['math', 'science'],
    status: 'selling',
  },
];

// individual book cards 
//WILL HAVE TO FIX TO BE CLICKABLE ??
const BookCard = ({ book, onToggleFavorite }) => {

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      position="relative"
      height="100%"
      bg="white"
    >
      <Box height="180px" bg="gray.100" position="relative">
        <Image 
          src={book.image} 
          alt={book.title}
          fallbackSrc="https://via.placeholder.com/150"
          objectFit="cover"
          width="100%"
          height="100%"
        />
        <IconButton
          aria-label="Add to favorites"
          icon={<StarIcon />}
          size="sm"
          position="absolute"
          top="2"
          right="2"
          borderRadius="full"
          colorScheme={book.favorite ? "red" : "gray"}
          onClick={() => onToggleFavorite(book.id)}
        />
      </Box>
      
      <Box p="3">
        <Text 
          fontWeight="semibold" 
          fontSize="sm" 
          noOfLines={2}
          mb="1"
        >
          {book.title}
        </Text>
        
{/*TAGS HARDCODED FOR NOW*/}
        <HStack mb="2" flexWrap="wrap">
          {book.category && book.category.map((cat, idx) => (
            <Badge 
              key={idx} 
              colorScheme="gray" 
              fontSize="xx-small"
              px="1"
            >
              {cat}
            </Badge>
          ))}
        </HStack>
        
        {book.condition && (
          <Badge 
            colorScheme="blue" 
            fontSize="xx-small"
            mb="2"
          >
            {book.condition}
          </Badge>
        )}
        
        {book.price && (
          <Text 
            fontWeight="bold" 
            color="gray.700"
            fontSize="sm"
          >
            {book.price}
          </Text>
        )}
      </Box>
    </Box>
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