import { Box, Flex, Text, Image } from "@chakra-ui/react";
//import banner_image from "../images/banner.png";
import { InfiniteSlider } from './InfiniteSlider';
import p1 from '../images/p1.png';
import p2 from '../images/p2.png';
import p3 from '../images/p3.png';
import p4 from '../images/p4.png';
import p5 from '../images/p5.png';
import p6 from '../images/p6.png';
import p7 from '../images/p7.png';
import p8 from '../images/p8.png';
import p9 from '../images/p9.png';
import p10 from '../images/p10.png';
import p11 from '../images/p11.png';

const Banner = () => {
  const images = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11];
  return (
    <Box position="relative" width="100%" height="300px">
    <InfiniteSlider direction="horizontal">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          style={{
            width: '200px',
            height: '300px',
            objectFit: 'cover',
            opacity: 0.6,
            filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))',
          }}        />
      ))}
    </InfiniteSlider>
        <Text
           position="absolute"
           top="40%"
           left="50%"
           transform="translate(-50%, -50%)"
           fontSize="9xl"
           fontFamily="NanumMyeongjo"
           zIndex="1"
           pointerEvents={"none"}
           color="black"
           sx={{
            //WebkitTextStroke: '1px white',
            textShadow: '0 0 20px rgba(0, 0, 0, 0.68)'
          }}
        >
          MISO
        </Text>

        <Text
            position="absolute"
            top="70%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="4xl"
            color="black"
            sx={{
              //WebkitTextStroke: '1px white',
              textShadow: '0 0 20px rgba(0, 0, 0, 0.68)'
            }}>
            Tasty Deals on Textbooks!
        </Text>
    </Box>
    //<Box position="relative" width="100%">
        
    //</Box>
  );
};

export default Banner;
