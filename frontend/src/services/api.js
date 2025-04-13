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

export const fetchUserProducts = async (userId) => {
    // console.log("Verifying userId in fetchUserProducts:", userId);
    try {
        const response = await fetch(`${API_URL}/users/${userId}/userProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.userProducts?.map((item) => item.product || item) || data; // Assuming the response contains a 'products' field
    } catch (error) {
        console.error("Error fetching user products:", error);
        throw error;
    }
};

export const fetchProductById = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
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

export const updateUsersRequestedGlobally = async (userId, productId, userPostedId) => {
    try {
        const response = await fetch(`${API_URL}/updateUsersRequestedGlobally`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId, userPostedId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user's requested products globally:", error);
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

export const makeRequest = async (productId, userId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to make request.");
      }
  
      return data;
    } catch (error) {
      console.error("Error making request:", error);
      throw error;
    }
  };

export const updateUserProducts = async (authBooksRequested, userId) => {
    // console.log("Verifying userId in updateUserProducts:", userId);
    // console.log("Verifying authBooksRequested in updateUserProducts:", authBooksRequested);
    
    try {

        if (authBooksRequested.length === 0) {
            console.log("No books requested, no need to update.");
            return;
        }

        const response = await fetch(`/api/users/${userId}/productRequested`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestedBooks: authBooksRequested }),
        });
        if (!response.ok) {
            throw new Error("Failed to update productsRequested.");
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching user products:", error);
        throw error;
    }
}

export const getUserRequestedBooksIds = async (userId) => {
    try {
        console.log("HERE 1!!!! [getUsreRequestedBooksIds]");
        const response = await fetch(`${API_URL}/users/${userId}/productsRequested`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.requestedBooks;
    } catch (error) {
        console.error("Error fetching user requested books:", error);
        throw error;
    }
}


export const getUserNameFromID = async (userId) => {
    console.log("USER ID [getUserNameFromID]: ", userId);
    // if (!userId) {
    //     console.error("User ID is null or undefined.");
    //     return null;
    // }
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.userName;
    } catch (error) {
        console.error("Error fetching user name:", error);
        throw error;
    }
}


export const updateBookSoldByToOther = async (userId, productId, soldToUserId) => {
    try {
        const response = await fetch(`${API_URL}/updateBookSoldByToOther`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId, soldToUserId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating book sold by to other:", error);
        throw error;
    }
}


// Other API calls...