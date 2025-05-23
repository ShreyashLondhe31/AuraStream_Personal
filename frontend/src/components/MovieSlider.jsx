import React, { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({
  category,
  content: propContent,
  onPlayTrailer,
  isRecentlyViewed = false,
  isContinueWatching = false
}) => {
  const { contentType } = useContentStore();
  const formattedCategoryType =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

  const [content, setContent] = useState(propContent || []);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef();

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };
  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!propContent) {
      // <----- Conditional fetching
      const getContent = async () => {
        const res = await axios.get(`/api/v1/${contentType}/${category}`);
        setContent(res.data.content);
      };
      getContent();
    } else if (propContent) {
      // <----- Use propContent if provided
      setContent(propContent);
    }
  }, [contentType, category, propContent, isRecentlyViewed]);

  const sliderTitle = isContinueWatching
  ? "Continue Watching"
    : formattedCategoryType; 
     

  return (
    <>
      <div
        className="text-white bg-black relative px-5 md:px-20"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        <h2 className="mb-4 text-2xl font-bold">
         {sliderTitle}
        </h2>
        <div
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
          ref={sliderRef}
        >
          {content.map((item) => (
            
            <Link
              to={`/watch/${item.id}`}
              className="min-w-[250px] realtive group"
              key={item.id}
              onClick={(e) => {
                // Assuming clicking the item plays the trailer (before navigating)
                onPlayTrailer(item.id, item.media_type || contentType, item.title || item.name); 
                console.log(item)
              }}
            >
              <div className="rounded-lg overflow-hidden">
                
                <img
                  src={SMALL_IMG_BASE_URL + item.backdrop_path}  // (isRecentlyViewed && item.backdrop_path ? item.backdrop_path : item.poster_path)
                  alt="Movie image"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                />
              </div>
              <p className="mt-2 text-center">{item.title || item.name}</p>
            </Link>
          ))}
        </div>
        {showArrows && (
          <>
            <button
              className="absolute top-1/2 -translate-y-1/2 left-5 md:left-20 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
              onClick={scrollLeft}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 -translate-y-1/2 right-5 md:right-20 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
              onClick={scrollRight}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default MovieSlider;
