import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast,
	VStack
} from "@chakra-ui/react";
// import { useProductStore } from "../store/product";
import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import db from "../firebase-client";

const ProductCard = ({product, onDelete, onUpdate }) => {
    const [updatedProduct, setUpdatedProduct] = useState(product);

    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");
    
    // const { deleteProduct, updateProduct} = useProductStore()
    const toast = useToast();
    // for the modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDeleteProduct = async (productId) => {
        try {

            // console.log("Deleting product with ID:", productId); // Debug log
            
            // Check if productId is valid
            if (!productId) {
                throw new Error("Invalid product ID");
            }
            // const {success, message} = await deleteProduct(productId);
            const productRef = doc(db, "products", productId);

            // delete the document:
            await deleteDoc(productRef);

            if (onDelete) onDelete();

            toast({
                title: "Success",
                description: "Product deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const handleUpdateProduct = async (productId, updatedProduct) => {
        try {
            // const {success, message} = await updateProduct(productId, updatedProduct);
            const productRef = doc(db, "products", productId);

            // Format the price as a number
            const formattedProduct = {
                ...updatedProduct,
                price: parseFloat(updatedProduct.price),
                updatedAt: new Date()
            };

            // update the document:
            await updateDoc(productRef, formattedProduct);

            if (onUpdate) onUpdate();

            onClose();
            toast({
                title: "Success",
                description: "Product updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }


    return (
        <Box
        shadow='lg'
        rounded='lg'
        overflow='hidden'
        transition='all 0.3s'
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}
        >
            <Image src={product.image} alt={product.name} h={48} w='full' objectFit='cover' />

            <Box p={4}>
                <Heading as='h3' size='md' mb={2}>
                    {product.name}
                </Heading>

                <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
                    ${product.price}
                </Text>

                <HStack spacing={2}>
                    <IconButton icon={<EditIcon />}
                        onClick={onOpen}
                    colorScheme='blue' />
                    <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteProduct(product.id) }
                        colorScheme='red'
                    />
                </HStack>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input placeholder='Product Name' name='name' value={updatedProduct.name}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}/>
                            <Input placeholder='Price' name='price' type='number' value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}/>
                            <Input placeholder='Image URL' name='image' value={updatedProduct.image}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}/>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3}
                        onClick={() => handleUpdateProduct(product.id, updatedProduct)}>
                            Update
                        </Button>
                        <Button variant='ghost' onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
};
export default ProductCard;