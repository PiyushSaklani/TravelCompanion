import React, { useState, useEffect } from "react";
import "../image_slider/image_slider.css";
import { Link } from "react-router-dom";

function Image_Slider() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1856&q=80",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    "https://images.unsplash.com/photo-1580389915859-6b30058157d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
    "https://images.unsplash.com/photo-1665909540210-a22d53f2175f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1792&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFyaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  ];

  const getNextImageIndex = () => {
    return (currentImage + 1) % images.length;
  };

  // useEffect(() => {
  //   const sliderInterval = setInterval(() => {
  //     setCurrentImage(getNextImageIndex());
  //   }, 3000); // Change the duration (in milliseconds) as needed

  //   return () => {
  //     clearInterval(sliderInterval);
  //   };
  // }, [currentImage]);

  const getImageAtIndex = (index) => {
    if (index < 0) {
      return images[images.length - 1];
    } else if (index >= images.length) {
      return images[0];
    } else {
      return images[index];
    }
  };

  return (
    <div className="mp-image-div">
      <div className="mp-image-slider-div-near">
        <img
          src={getImageAtIndex(currentImage - 1)}
          alt={`Previous Image ${currentImage}`}
          className="mp-image"
        />
        <div class="mp-image-overlay">
          <div class="mp-image-slider-inner-div">
            <div className="place-name">Discover Paris's Charm</div>
            <Link to={`/initial_explore/0/3/Paris`}>
              <div className="explore-place">Explore</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="mp-image-slider-div">
        <img
          src={getImageAtIndex(currentImage)}
          alt={`Image ${currentImage + 1}`}
          className="mp-image"
        />
        <div class="mp-image-overlay">
          <div class="mp-image-slider-inner-div">
            <div className="place-name">Vietnam's Hidden Gems</div>
            <Link to={`/initial_explore/0/3/Vietnam`}>
              <div className="explore-place">Explore</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="mp-image-slider-div-near">
        <img
          src={getImageAtIndex(currentImage + 1)}
          alt={`Next Image ${currentImage + 2}`}
          className="mp-image"
        />
        <div class="mp-image-overlay">
          <div class="mp-image-slider-inner-div">
            <div className="place-name">Explore Himachal's Beauty</div>
            <Link to={`/initial_explore/0/3/Himachal`}>
              <div className="explore-place">Explore</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Image_Slider;
