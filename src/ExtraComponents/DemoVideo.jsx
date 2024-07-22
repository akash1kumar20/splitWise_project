import React from "react";
import video from "./../Media/Video.mp4";
import ReactDOM from "react-dom";
const DemoVideo = ({ demoVideo }) => {
  const closeDemo = () => {
    demoVideo();
  };
  return ReactDOM.createPortal(
    <div className="top-0 fixed bg-black h-[100vh] bg-opacity-90 z-50">
      <p
        className="text-white text-3xl text-center cursor-pointer pt-1"
        onClick={closeDemo}
      >
        X
      </p>
      <video src={video} controls autoPlay className="mx-auto  md:w-[80%]  " />
    </div>,
    document.querySelector("#demo")
  );
};

export default DemoVideo;
