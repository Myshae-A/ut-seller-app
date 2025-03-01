import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true // createdAt and updatedAt for each document
});

const Product = mongoose.model('Product', productSchema);
// will convert 'Product' to 'products' collection in the database
// mongoose will lowercase and pluralize the model name

export default Product;