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
           fontSize="9xl"
           fontFamily="NanumMyeongjo"
           color="black"
        >
          MISO
        </Text>

        <Text
            position="absolute"
            top="70%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="4xl"
            color="black">
            Tasty Deals on Textbooks!
        </Text>
    </Box>
  );
};

export default Banner;
