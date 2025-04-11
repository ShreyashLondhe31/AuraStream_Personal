import axios from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user:null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isLoggningIn: false,
    signup: async (credentials) => {
        set({isSigningUp: true})
        try {
            const response = await axios.post("/api/v1/auth/signup", credentials);
            set({user:response.data.user, isSigningUp: false})
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong")
            set({isSigningUp: false, user: null})
        }
    },
    login:async(credentials) => {
        set({isLoggningIn:true})
        try {
            const response = await axios.post("/api/v1/auth/login", credentials)
            set({user:response.data.user, isLoggningIn: false})
            toast.success("Login successfully")
        } catch (error) {
            toast.error(error.response.data.message || "Login failed")
            set({isLoggningIn: false, user: null})
        }
    },
    logout:async() => {
        set({isLoggingOut: true})
        try {
            const response = await axios.post("/api/v1/auth/logout")
            set({user: null, isLoggingOut: false})
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message || "Logout failed")
            set({isLoggingOut: false, user: null})
        }
    },
    authCheck:async() => {
        set({isCheckingAuth: true})
        try {
            const response = await axios.get("/api/v1/auth/authCheck")
            set({user:response.data.user, isCheckingAuth: false})
            
        } catch (error) {
            set({isCheckingAuth: false, user: null})
            // toast.error(error.response.data.message || "Something went wrong")
        }
    }
}))