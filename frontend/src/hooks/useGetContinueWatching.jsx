// hooks/useGetContinueWatching.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authUser';

const useGetContinueWatching = () => {
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profile = useAuthStore((state) => state.selectedProfile);
  const user = useAuthStore((state) => state.user);

  const fetchContinueWatching = useCallback(async () => {
    if (user && profile) {
      setLoading(true);
      console.log("Fetching continue watching data..."); 
      try {
        const response = await axios.get('/api/v1/continuewatching', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            profileId: profile._id,
          },
        });
        console.log("Continue watching data fetched:", response.data.continueWatching);
        setContinueWatching(response.data.continueWatching);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch continue watching data');
        setLoading(false);
      }
    } else {
      setContinueWatching([]);
      setLoading(false);
    }
  }, [user, profile]); // useCallback dependency array

  useEffect(() => {
    fetchContinueWatching();
  }, [fetchContinueWatching]); // useEffect dependency array

  return { continueWatching, loading, error, refetch: fetchContinueWatching };
};

export default useGetContinueWatching;