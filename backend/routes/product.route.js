import express from 'express';

import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/listings', getProducts);
router.get('/email', createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
