import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';



export const useProfileStore = create((set, get) => ({
    profiles: [],
    loading: false,
    error: null,

    fetchProfiles: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/profile/${userId}`);
            set({ profiles: response.data.profiles });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch profiles' });
            
        } finally {
            set({ loading: false });
        }
    },

    createProfile: async ({ profileName, profileImage }) => { // Receive profileImage here
        set({ loading: true, error: null });
        console.log("Profile Data:", { profileName, profileImage });
        try {
          const response = await axios.post(
            '/api/v1/profile/',
            { profileName, profileImage }, // Send profileImage to the backend
            {
              withCredentials: true,
            }
          );
          set({ profiles: [...get().profiles, response.data.profile] });
          toast.success(response.data.message);
        } catch (error) {
          set({ error: error.message || 'Failed to create profile' });
          throw error; // Rethrow the error to be handled in the component
        } finally {
          set({ loading: false });
        }
      },

    updateProfile: async (profileId, profileData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/profile/${profileId}`, profileData);
            set({
                profiles: get().profiles.map((profile) =>
                    profile._id === profileId ? response.data.profile : profile
                ),
            });
        } catch (err) {
            set({ error: err.message || 'Failed to update profile' });
        } finally {
            set({ loading: false });
        }
    },

    deleteProfile: async (profileId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/profile/${profileId}`);
            set({ profiles: get().profiles.filter((profile) => profile._id !== profileId) });
        } catch (err) {
            set({ error: err.message || 'Failed to delete profile' });
        } finally {
            set({ loading: false });
        }
    },
}));
