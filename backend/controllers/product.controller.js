import mongoose from 'mongoose';
import Product from '../models/product.model.js';

export const getProducts = async (req, res) => {
    try {
        // empty object {} means you fetch all the products that we have in the database
        const products = await Product.find({}); 
        res.status(200).json({success: true, data: products});
    } catch (error) {
        console.log("Error in fetching products: ", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const createProduct = async (req, res) => {
    const product = req.body; // data that the user sends

    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success:false, message: 'Please provide all fields' });
    }

    const newProduct = new Product(product);

    try {
        // will save this new product to the database
        await newProduct.save();
        // 201 means something successfully created
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creating product: ", error.message);
        // 500 means internal server error
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;

    const product = req.body; // field such as name, price, & image

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid product id' });
    }

    // try to update it into the database
    try {
        // { new : true } part returns the updated product/object
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch { // usually won't be hitting this below error
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    // console.log("id: ", id); // to test, it's whatever you type in the URL

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid product id' });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.log("Error in deleting product: ", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
