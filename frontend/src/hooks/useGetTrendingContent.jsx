import React, { useEffect, useState } from 'react'
import { useContentStore } from '../store/content'
import axios from 'axios'


 const useGetTrendingContent = () => {
    const [trendingContent, setTrendingContent] = useState(null)
    const{contentType} = useContentStore()

    useEffect(() => {
        console.log("useGetTrendingContent - contentType:", contentType);
        const getTrendingContent = async () => {
          try {
            const res = await axios.get(`/api/v1/${contentType}/trending`);
            console.log("useGetTrendingContent - API Response:", res.data);
            setTrendingContent(res.data.content);
          } catch (error) {
            console.error("useGetTrendingContent - Error fetching:", error);
          }
        };
      
        getTrendingContent();
      }, [contentType]);

  return {
    trendingContent
}
}

export default useGetTrendingContent
