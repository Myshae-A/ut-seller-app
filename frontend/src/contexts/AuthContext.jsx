// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth } from '../firebase-client';
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "../firebase-client";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase-client";

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app); // Firestore instance

// Creating a context for authentication. Contexts provide a way to pass data through 
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();

// This is a custom hook that we'll use to easily access our authentication context from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};

// This is our authentication provider component.
// It uses the context to provide authentication-related data and functions to its children components.
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState(null);
    loading ? console.log("Loading...") : console.log("Loaded");
    // const VALID_USERNAME = 'myshae'
    // const VALID_PASSWORD = 'racecar'

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
            
            if (user) {
                // Store minimal user info in localStorage
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email
                }));
                
                // Check if user document exists, if not create it
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (!userDoc.exists()) {
                        await setDoc(userDocRef, {
                            email: user.email,
                            createdAt: new Date(),
                            listings: []
                        });
                        console.log("User document created in Firestore");
                    }
                } catch (error) {
                    console.error("Error checking/creating user document:", error);
                }
            } else {
                localStorage.removeItem('user');
            }
        });

        return unsubscribe;
    }, []);

    // sign up new users
    // Register function
    const register = async (email, password) => {
        try {
            setLoginError(null);
            
            if (!email.endsWith('@utexas.edu')) {
                setLoginError('Please enter a valid UTexas email address.');
                return { success: false, message: 'Please enter a valid UTexas email address.' };
            }
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Add the user document to Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date(),
                listings: []
            });
            
            navigate("/home");
            return { success: true, message: 'Account successfully created.' };
        } catch (error) {
            setLoginError(error.message);
            return { success: false, message: error.message };
        }
    };

    // Log in existing users
    const login = async (email, password) => {
        try {
            setLoginError(null);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
            return { success: true, message: 'Login successful.' };
        } catch (error) {
            setLoginError(error.message);
            return { success: false, message: 'Username or password is invalid.' };
        }
    };

    // Sign out users
    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
            return { success: true, message: 'Logout successful.' };
        } catch (error) {
            console.error("Logout error:", error);
            return { success: false, message: error.message };
        }
    };

    // An object containing our state and functions related to authentication.
    // By using this context, child components can easily access and use these without prop drilling.
    const value = {
        currentUser,
        login,
        logout,
        register,
        loginError
    };

    // The AuthProvider component uses the AuthContext.Provider to wrap its children.
    // This makes the contextValue available to all children and grandchildren.
    // Instead of manually passing down data and functions, components inside this provider can
    // simply use the useAuth() hook to access anything they need.
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}