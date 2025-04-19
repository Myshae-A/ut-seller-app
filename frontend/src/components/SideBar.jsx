import React, { useState } from 'react';
import { 
  Tooltip,
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

const SideSearchTab = ({
  isOpen,
  onClose,
  onOpen,
  selectedSubjects,
  setSelectedSubjects,
  selectedConditions,
  setSelectedConditions,
  selectedDepartment,
  setSelectedDepartment,
  selectedCatalogNumber,
  setSelectedCatalogNumber,
  onApplyFilters,
}) => {


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


  const handleApplyFilters = () => {
    // Pass the selected filters to the parent component
    onApplyFilters({
      subjects: selectedSubjects,
      conditions: selectedConditions,
      department: selectedDepartment,
      catalogNumber: selectedCatalogNumber,
    });

    // Close the drawer
    onClose();
  };


  {/* Subjects for now */}
  // const subjects = [
  //   'math',
  //   'english',
  //   'science',
  //   'visual and performing arts',
  //   'first-year signature course',
  //   'government',
  //   'history'
  // ];
  const subjects = [
    'Fiction',
    'Non-Fiction',
    'Reference',
  ];

  {/* Departments for now */}

  const department = [
    'Arts',
    'Science',
    'History',
  ];

  const catalogNumber = [
    'ISBN',
    'UPC',
    'SKU',
  ]

  {/* Conditions for now */}
  // const conditions = [
  //   'brand new',
  //   'like new',
  //   'gently used',
  //   'fairly used',
  //   'heavily used'
  // ];
const conditions = [
  'New',
  "Like New",
  "Good",
  "Fair"
]


  return (
    <>
      {/* Floating Filter Button */}
      <Tooltip label="Use search filters" aria-label="Logout tooltip">
        <IconButton 
          icon={<ChevronRightIcon />}
          position="fixed"
          top="5%"
          left="0"
          transform="translateY(-70%)"
          zIndex="1000"
          bgColor="#DD8533"
          color="white"
          borderLeftRadius="none"
          borderRightRadius="50"
          onClick={onOpen}
          aria-label="Open Filters"
          size="md"
          px={8}
        />
      </Tooltip>

      {/* Drawer Sidebar */}
      <Drawer 
        isOpen={isOpen} 
        placement="left"
        onClose={onClose}
        
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
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="">Select a Department</option> {/* Placeholder option */}
                    {department.map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                </Select>
            </VStack>

            {/* Catalog Number Section */}
            <VStack align="stretch" mb={4}>
              <Text fontSize="lg">Catalog Number</Text>
              <Select
                value={selectedCatalogNumber}
                onChange={(e) => setSelectedCatalogNumber(e.target.value)}
              >
                <option value="">Select a Catalog Number</option> {/* Placeholder option */}
                {catalogNumber.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
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
              onClick={handleApplyFilters}
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