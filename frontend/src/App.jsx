import React, { useRef } from "react";
import Connect from "./components/Connect";
import Transfer from "./components/Transfer";
import greenEllipse from "./assets/green-ellipse.svg";

function App() {
  const connectPageRef = useRef(null);
  const transferPageRef = useRef(null);

  const handleScroll = () => {
    connectPageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative w-screen h-screen flex flex-col justify-start overflow-x-hidden">
      <div id="navbar" className="text-[#181C17] mt-40 ml-[16%] w-fit">
        <h1 className="text-8xl text-shadow-md font-bold tracking-wide mb-6">
          Playlist Port
        </h1>
        <p className="text-3xl text-shadow-xs font-medium text-[#636B61]">
          Transfer your playlists through streaming services.
        </p>
      </div>

      <button
        onClick={handleScroll}
        className="border-2 border-[#FAFAF9] text-[#395D28] bg-linear-to-r from-[#F0F6EE] to-[#99F53D] w-fit px-10 py-3 rounded-full text-5xl self-center mt-72 font-medium tracking-wide shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.20)] mb-64 transform transition-all duration-200 ease-in-out hover:-translate-y-0.5"
      >
        Start
      </button>

      <img src={greenEllipse} className="absolute top-80 w-full h-lvh -z-10" />

      <section ref={connectPageRef}>
        <Connect />
      </section>

      <section ref={transferPageRef}>
        <Transfer />
      </section>
    </div>
  );
}

export default App;
