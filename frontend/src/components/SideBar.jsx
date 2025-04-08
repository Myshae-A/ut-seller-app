import React, { useState } from 'react';
import { 
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack, 
  Input, 
  InputGroup, 
  Button, 
  Text, 
  Divider,
  Stack,
  Select,
  IconButton,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

const SideSearchTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  
  const toggleDrawer = () => setIsOpen(!isOpen);

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleCondition = (condition) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(s => s !== condition)
        : [...prev, condition]
    );
  };

  {/* Subjects for now */}
  const subjects = [
    'math',
    'english',
    'science',
    'visual and performing arts',
    'first-year signature course',
    'government',
    'history'
  ];

  {/* Conditions for now */}
  const conditions = [
    'brand new',
    'like new',
    'gently used',
    'fairly used',
    'heavily used'
  ];

  return (
    <>
      {/* Floating Filter Button */}
      <IconButton 
        icon={<ChevronRightIcon />}
        position="fixed"
        top="6%"
        left="0"
        transform="translateY(-50%)"
        zIndex="1000"
        bgColor="#DD8533"
        color="white"
        borderLeftRadius="none"
        borderRightRadius="50"
        onClick={toggleDrawer}
        aria-label="Open Filters"
        size="lg"
        px={8}
      />

      {/* Drawer Sidebar */}
      <Drawer 
        isOpen={isOpen} 
        placement="left"
        onClose={toggleDrawer}
        
      >
        <DrawerOverlay />
        <DrawerContent
            bg= {"rgb(224, 222, 222)"}

        >
          <DrawerCloseButton/>
          <DrawerHeader
            fontSize="3xl" 
            fontWeight="light"
            py={6}
            paddingTop={10}
          > 
            Filters   
          </DrawerHeader>

          <DrawerBody>
            {/* Subject Section */}
            <VStack align="stretch">
              <Text fontSize="lg">Subject</Text>
              <Wrap>
                {subjects.map((subject) => (
                  <WrapItem key={subject}>
                    <Button
                      size="sm"
                      borderRadius={30}
                      bg={selectedSubjects.includes(subject) ? "rgba(221, 147, 51, 0.4)" : 'rgb(195, 195, 195)'}
                      onClick={() => toggleSubject(subject)}
                      textTransform="capitalize"
                    >
                      {subject}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>

            {/* Department Section */}
            <VStack align="stretch" mb={4}>
                <Text fontSize="lg">Deparment</Text>
                <Select 
                    name="department" 
                    placeholder="Select a Department" 
                    bg={'rgb(195, 195, 195)'}
                    variant="filled" 
                    size="md"
                >
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                </Select>
            </VStack>

            {/* Condition Section */}
            <VStack align="stretch">
              <Text fontSize="lg">Condition</Text>
              <Wrap>
                {conditions.map((condition) => (
                  <WrapItem key={condition}>
                    <Button
                      size="sm"
                      borderRadius={30}
                      bg={selectedConditions.includes(condition) ? "rgba(221, 147, 51, 0.4)" : 'rgb(195, 195, 195)'}
                      onClick={() => toggleCondition(condition)}
                      textTransform="capitalize"
                    >
                      {condition}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>

            {/* Apply Filters Button */}
            <Button 
              bgColor={"rgb(221, 147, 51)"} 
              mt={4} 
              width="full"
              borderRadius="full"
              onClick={toggleDrawer}
            >
              Apply Filters
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideSearchTab;