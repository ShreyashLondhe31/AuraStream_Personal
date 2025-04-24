import React, { useCallback, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Play, Info } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../../utils/constants";
import { useContentStore } from "../../store/content";
import MovieSlider from "../../components/MovieSlider";
import useGetContinueWatching from "../../hooks/useGetContinueWatching";

import { useAuthStore } from "../../store/authUser";
import axios from "axios";




const HomeScreen = () => {
  const {
    continueWatching,
    loading: continueWatchingLoading,
    error: continueWatchingError,
    refetch: refetchContinueWatching
  } = useGetContinueWatching();
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);
  const navigate = useNavigate();

  const { user, selectedProfile } = useAuthStore();


  const handlePlayTrailer = useCallback(
    async (mediaId, mediaType, title, backdropPath, posterPath) => {
      
      
      navigate(`/watch/${mediaId}`);

      // Call the addToContinueWatching API
      if (user && selectedProfile) {
        try {
          await axios.post(
            '/api/v1/continuewatching',
            {
              mediaId: mediaId,
              mediaType: mediaType,
              title: title,
              posterPath: posterPath, 
              backdropPath: backdropPath
              
            },
            
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          // After successfully adding, refetch the continue watching list
          if (refetchContinueWatching) {
            refetchContinueWatching();
          }
        } catch (error) {
          console.error("Error adding to continue watching:", error);
          // Optionally handle the error (e.g., show a notification)
        }
      }
    },
    [ navigate, refetchContinueWatching, user, selectedProfile]
  );

  if (!trendingContent)
    return (
      <div className="h-screen text-white relative">
        <Navbar />

        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer"
          onLoad={() => {
            setImgLoading(false);
          }}
        />
      </div>
    );

  return (
    <>
      <div className="relative h-screen text-white">
        <Navbar />
        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          alt="Hero img"
          className="absolute top-0 left-0 w-full h-full object-cover -z-50"
        />

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50"
          aria-hidden="true"
        />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
          <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />

          <div className="max-w-2xl">
            <h1 className="mt-2 text-6xl font-extrabold text-balance">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 text-lg">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date?.split("-")[0]}{" "}
              | {trendingContent?.adult ? "18+" : "PG-13"}
            </p>
            <p className="mt-4 text-lg">
              {trendingContent?.overview?.length > 200
                ? `${trendingContent?.overview.slice(0, 200)}...`
                : trendingContent?.overview}
            </p>
          </div>

          <div className="flex mt-8">
            <Link
              to={`/watch/${trendingContent?.id}`}
              onClick={(e) => {
                e.preventDefault(); // Prevent default navigation
                handlePlayTrailer(
                  trendingContent?.id,
                  contentType,
                  trendingContent?.title || trendingContent?.name,
                  trendingContent?.backdrop_path, // Pass the backdrop path
                  trendingContent?.poster_path // Pass the poster path
                );
              }}
              className="bg-white hover:bg-white/50 text-black font-bold py-2 px-4 rounded mr-4 flex items-center"
            >
              <Play className="size-6 inline-block mr-2 fill-black" />
              Play
            </Link>

            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center "
            >
              <Info className="size-6 mr-2 " />
              More info
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10">
        {continueWatchingLoading && (
          <p className="text-white px-8">Loading Continue Watching...</p>
        )}
        {continueWatchingError && (
          <p className="text-red-500 px-8">{continueWatchingError}</p>
        )}
          
        {continueWatching && continueWatching.length > 0 && (
          <MovieSlider
            key="continue_watching"
            category="continue_watching"
            content={continueWatching.map((item) => ({
              id: item.mediaId,
              media_type: item.mediaType,
              title: item.title,
              name: item.title,
              backdrop_path: item.backdropPath,
              poster_path: item.posterPath,
              currentTime: item.currentTime,
              totalDuration: item.totalDuration,
            }))}
            onPlayTrailer={() => {
              /* You might not have a direct "play trailer" from here */
            }}
            isContinueWatching={true}
          />
        )}
        
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
      </div>
    </>
  );
};

export default HomeScreen;
