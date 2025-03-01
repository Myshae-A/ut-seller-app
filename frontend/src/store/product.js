import { create } from "zustand";

// is global state, because we can use these in ANY components in our project now
export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return {success:false, message: "Please fill in all fields."};
        }
        // if we pass the check above, we can create a new product
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        })
        const data = await res.json();
        set((state) => ({ products: [...state.products, data.data] }));
        return {success:true, message: "Product created succesfilly."};
    },
    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({ products: data.data });
    },
    deleteProduct: async (productId) => {
        const res = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // updates UI IMMEADIATELY without needing a refresh (set(state))
        set((state) => ({  // basically deletes the current product from the state
            products: state.products.filter((product) => product._id !== productId),
        }));
        return { success: true, message: data.message };
    },
    updateProduct: async (productId, updatedProduct) => {
        if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.image) {
            return { success: false, message: "Please fill in all fields." };
        }
        const res = await fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // update the UI immediately without needing a refresh (set(state))
        set((state) => ({
            products: state.products.map((product) => {
                if (product._id === productId) {
                    return data.data;
                }
                return product;
            }),
        }));
        return { success: true, message: data.message };
    }
}));
