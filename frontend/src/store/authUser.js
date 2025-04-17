import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isSigningUp: false,
            isCheckingAuth: true,
            isLoggingOut: false,
            isLoggningIn: false,
            needsProfileSelection: false,
            selectedProfile: null,

            signup: async (credentials) => {
                set({ isSigningUp: true });
                try {
                    const response = await axios.post("/api/v1/auth/signup", credentials);
                    set({ user: response.data.user, isSigningUp: false });
                    toast.success("Account created successfully");
                } catch (error) {
                    toast.error(error.response?.data?.message || "Something went wrong");
                    set({ isSigningUp: false, user: null });
                }
            },

            login: async (credentials) => {
                set({ isLoggningIn: true });
                try {
                    const response = await axios.post("/api/v1/auth/login", credentials);
                    set({ user: response.data.user, isLoggningIn: false, selectedProfile: null, needsProfileSelection: true });
                    toast.success("Login successfully");
                } catch (error) {
                    toast.error(error.response?.data?.message || "Login failed");
                    set({ isLoggningIn: false, user: null, needsProfileSelection: false });
                }
            },

            logout: async () => {
                set({ isLoggingOut: true });
                try {
                    const response = await axios.post("/api/v1/auth/logout");
                    set({ user: null, isLoggingOut: false, selectedProfile: null, needsProfileSelection: false });
                    toast.success(response.data.message);
                    return response;
                } catch (error) {
                    toast.error(error.response?.data?.message || "Logout failed");
                    set({ isLoggingOut: false, user: null });
                    throw error;
                }
            },

            authCheck: async () => {
                set({ isCheckingAuth: true });
                try {
                    const response = await axios.get("/api/v1/auth/authCheck");
                    set({ user: response.data.user, isCheckingAuth: false });
                } catch (error) {
                    set({ isCheckingAuth: false, user: null });
                }
            },

            selectProfile: async (profile) => {
                try {
                    set({ selectedProfile: profile, needsProfileSelection: false });
                    console.log("Profile selected successfully:", profile);
                } catch (error) {
                    console.error("Error selecting profile:", error);
                    toast.error("Failed to select profile.");
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                selectedProfile: state.selectedProfile,
                needsProfileSelection: state.needsProfileSelection,
            }),
        }
    )
);