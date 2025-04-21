import { Box, Flex, Text, Image } from "@chakra-ui/react";
// import banner_image from "../images/banner.png";
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

import "./banner.css"; 

const Banner = () => {
  const images = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11];
  const loop = [...images, ...images]

  return (
    <Box position="relative" width="100%" height="300px" overflow="hidden">
        
        <Flex
          className="banner-scroller"
          as="div"
          align="center"
          h="100%"
          userSelect="none"
          flexWrap="nowrap"
          width="max-content"
        >
          {/* Allows infinite scroll without abrupt change (uses css) */}
          {loop.map((src, i) => (
            <Box key={i} minW="200px" h="300px" flexShrink={0}>
              <img
                src={src}
                alt={`Slide ${i % images.length + 1}`}
                style={{
                  width: "200px",
                  height: "300px",
                  objectFit: "cover",
                  opacity: 0.6,
                  filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))",
                }}
              />
            </Box>
          ))}
        </Flex>


        <Text
           position="absolute"
           top="40%"
           left="50%"
           transform="translate(-50%, -50%)"
           fontFamily="NanumMyeongjo"
           color="black"
           sx={{
            //WebkitTextStroke: '1px white',
            textShadow: '0 0 20px rgba(0, 0, 0, 0.68)'
          }}
           // fontSize="9xl"
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
            sx={{
              //WebkitTextStroke: '1px white',
              textShadow: '0 0 20px rgba(0, 0, 0, 0.68)'
            }}
            whiteSpace="pre"
            >
            Your Campus.  Your Books.  Your Price.
        </Text>
    </Box>
  );
};

export default Banner;
