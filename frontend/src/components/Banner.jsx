import { Box, Flex, Text, Image } from "@chakra-ui/react";
import banner_image from "../images/banner.png";

const Banner = () => {
  return (
    <Box position="relative" width="100%">
      <Image src={banner_image} alt="MISO Banner" width="100%" objectFit="cover" />
      
        <Text
           position="absolute"
           top="40%"
           left="50%"
           transform="translate(-50%, -50%)"
           fontFamily="NanumMyeongjo"
           color="black"
           fontWeight="light"    
           fontSize={{
            base: "4xl",   // mobile
            sm:   "6xl",   // small tablets
            md:   "8xl",   // larger tablets
            lg:   "9xl",   // desktop
          }}
               >
          MISO
        </Text>

        <Text
            position="absolute"
            top="70%"
            left="50%"
            transform="translate(-50%, -50%)"
            // fontSize="4xl"
            fontSize={{
              base: "lg",    // phones
              sm:   "xl",    // small tablets
              md:   "2xl",   // larger tablets
              lg:   "3xl"    // desktop
            }}
          
            color="black"
            >
            Tasty Deals on Textbooks!
        </Text>
    </Box>
  );
};

export default Banner;
