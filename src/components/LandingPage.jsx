import React, { useEffect } from "react";
import "./LandingPage.css";
import Spline from "@splinetool/react-spline";

function LandingPage() {
  useEffect(() => {
    const handleClick = (event) => {
      // Get viewport dimensions
      const { innerWidth, innerHeight } = window;

      // Check if the click is in the top-right quarter of the screen
      if (event.clientX > innerWidth / 2 && event.clientY < innerHeight / 2) {
        // Navigate to the next page
        window.location.href = "/login";
      }
    };

    // Add click event listener
    document.addEventListener("click", handleClick);

    // Cleanup event listener on component unmount
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="container">
      {/* Use the absolute URL or hosted URL for the Spline scene */}
      <Spline scene="src\components\scene.splinecode" />
    </div>
  );
}

export default LandingPage;
