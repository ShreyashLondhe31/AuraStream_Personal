import React, { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import { useAuthStore } from "../store/authUser"; // Corrected import path for auth store

function formatReleaseDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType, setContentType } = useContentStore(); // Get the setter
  const sliderRef = useRef(null);
  const playerRef = useRef(null); // Ref for the ReactPlayer
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.selectedProfile);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const [hasStartedWatching, setHasStartedWatching] = useState(false);
  const [trailerPlaybackProgress, setTrailerPlaybackProgress] = useState(0);
  const [loadingTrailerProgress, setLoadingTrailerProgress] = useState(true);
  const [savedCurrentTime, setSavedCurrentTime] = useState(0);
  const [loadingInitialProgress, setLoadingInitialProgress] = useState(true);



  useEffect(() => {
    console.log("WatchPage mounted - Initial contentType:", contentType);
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
        let fetchedContentType = 'movie';
        if (res.data.content && res.data.content.hasOwnProperty('seasons')) {
          fetchedContentType = 'tv';
        }
        if (fetchedContentType !== contentType) {
          setContentType(fetchedContentType);
          console.log("Content type updated in getContentDetails to:", fetchedContentType);
        }
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id, setContentType]);

  
  useEffect(() => {
    const fetchContinueWatchingProgress = async () => {
      // ... your fetch logic (without mediaType in URL now) ...
      if (response.data && response.data.currentTime > 0) {
        setSavedCurrentTime(response.data.currentTime);
        console.log("Fetched saved currentTime:", response.data.currentTime);
      }
      // ...
    };
    fetchContinueWatchingProgress();
  }, [user, profile, id]); // Removed contentType from dependencies

  useEffect(() => {
    if (playerRef.current && !loadingInitialProgress && savedCurrentTime > 0) {
      playerRef.current.seekTo(savedCurrentTime);
      console.log("Seeking to saved time:", savedCurrentTime);
    }
  }, [playerRef, loadingInitialProgress, savedCurrentTime]);
  useEffect(() => {
    console.log("Current trailerPlaybackProgress before render:", trailerPlaybackProgress); // ADD THIS LOG
  }, [trailerPlaybackProgress]);

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };
    getTrailers();
  }, [contentType, id]);

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar.results);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
      }
    };
    getSimilarContent();
  }, [contentType, id]);



  const handlePlay = async () => {
    setIsFirstPlay(false);
    console.log("Content Type when saving:", contentType); 
    if (user && profile && content && !hasStartedWatching) {
      try {
        await axios.post(
          `/api/v1/continuewatching`,
          {
            mediaId: content.id,
            mediaType: contentType,
            title: content.title || content.name,
            backdropPath: content.backdrop_path,
            posterPath: content.poster_path,
            currentTime: 0,
            totalDuration: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setHasStartedWatching(true);
        console.log("Added to Continue Watching");
      } catch (error) {
        console.error("Error adding to Continue Watching:", error);
      }
    }
  };

  const handleProgress = (state) => {
    setPlaybackProgress(state.playedSeconds);
    if (totalDuration === 0 && state.loadedSeconds) {
      setTotalDuration(state.loadedSeconds);
    }
  };

  const handleSeek = (seconds) => {
    setPlaybackProgress(seconds);
  };

  const handleDuration = (duration) => {
    setTotalDuration(duration);
  };

  useEffect(() => {
    console.log("Continue Watching Update useEffect triggered");
    console.log("Dependencies:", {
      user,
      profile,
      content,
      isFirstPlay,
      hasStartedWatching,
    });
    const intervalId = setInterval(async () => {
      if (user && profile && content && !isFirstPlay && hasStartedWatching) {
        try {
          await axios.put(
            `/api/v1/continuewatching/${content.id}/${contentType}`,
            {
              currentTime: Math.floor(playbackProgress),
              totalDuration: Math.floor(totalDuration),
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              params: {
                profileId: profile._id,
              },
            }
          );
          console.log("Progress updated");
        } catch (error) {
          console.error("Error updating continue watching progress:", error);
        }
      }
    }, 5000); // Update every 10 seconds (adjust as needed)

    return () => {
      console.log("Continue Watching Update useEffect cleanup");
      clearInterval(intervalId);
    }; // Cleanup on unmount
  }, [
    user,
    profile,
    content,
    playbackProgress,
    totalDuration,
    contentType,
    isFirstPlay,
    hasStartedWatching,
  ]);

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  const handlePrev = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
  };

  const handleNext = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />
        {trailers.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={currentTrailerIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === trailers.length - 1
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers.length > 0 && (
            <ReactPlayer
              ref={playerRef}
              controls={true}
              width={"100%"}
              height={"70vh"}
              className="mx-auto overflow-hidden rounded-lg"
            //   url="/hero-vid.m4v"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx]?.key}`}
              onPlay={handlePlay}
              onProgress={handleProgress}
              onSeek={handleSeek}
              onDuration={handleDuration}
              initialSeek={trailerPlaybackProgress}
              playing={true}
            />
          )}

          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold text-red-600">
                {" "}
                {content?.title || content?.name}{" "}
              </span>{" "}
              😢
            </h2>
          )}
        </div>

        {/* movie details */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto ">
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {" "}
              {content?.title || content?.name}{" "}
            </h2>

            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600"> 18+ </span>
              ) : (
                <span className="text-green-600"> PG-13 </span>
              )}{" "}
            </p>
            <p className="mt-4 text-lg"> {content?.overview} </p>
          </div>
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="Poster Image"
            className="max-h-[450px] rounded-md "
          />
        </div>

        {/* simlar content */}

        {similarContent.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative no-scrollbar">
            <h3 className="text-3xl font-bold mb-4">Similar Movies/Tv Show</h3>
            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className="w-52 flex-none"
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt="Poster Image"
                      className="w-full h-auto rounded-md"
                    />
                    <h4 className="mt-2 text-lg font-semibold">
                      {content.title || content.name}
                    </h4>
                  </Link>
                );
              })}

              <button
                className="absolute top-1/2 -translate-y-1/2 left-2 md:left-2 flex items-center justify-center size-12 rounded-full bg-red-600 bg-opacity-50 hover:bg-opacity-75 text-white z-10"
                onClick={scrollLeft}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute top-1/2 -translate-y-1/2 right-2 md:right-2 flex items-center justify-center size-12 rounded-full bg-red-600 bg-opacity-50 hover:bg-opacity-75 text-white z-10"
                onClick={scrollRight}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
