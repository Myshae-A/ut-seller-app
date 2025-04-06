// Update with your backend URL, make sure to swtich to this for prouction
const API_URL = 'https://ut-seller-app-backend.vercel.app/api'; 

// const API_URL = 'http://localhost:5000/api'; // Update with your backend URL, for testing locally

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const addProductToGlobal = async (product) => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        const data = await response.json();
        return data.product; // big assumption here that backend returns the id of the new product
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const addProductToUser = async (userId, product) => {

    
    // console.log("once again, verifiying userId: ", userId);
    // console.log("Verifying product in frontend:", product);

    try {
        const response = await fetch(`${API_URL}/users/${userId}/productsPosted`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding product to user:", error);
        throw error;
    }
};

export const uploadImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_URL}/upload-image`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export const updateProduct = async (productId, updatedProduct) => {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const registerUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error registering user:", error);
        return { success: false, message: error.message };
    }
};

export const registerGoogleUser = async (uid) => {
    try {
        const response = await fetch(`${API_URL}/register-google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error registering Google user:", error);
        return { success: false, message: error.message };
    }
};

export const updateUserProfile = async (userId, profileImage) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/profile-image`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage }),
        });

        const data = await response.json();
        if (!response.ok) {
        throw new Error(data.message || "Failed to update profile image.");
        }

        return data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};


// Other API calls...