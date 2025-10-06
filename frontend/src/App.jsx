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
    <div className="max-w-[60rem] flex flex-col">
      <div className="flex flex-col h-dvh">
        <div id="navbar" className="mt-30">
          <h1 className="text-[#181C17] text-8xl text-shadow-lg font-bold tracking-wide">
            Playlist Port
          </h1>
          <p className="text-[#636B61] mt-6 text-3xl font-medium">
            Transfer your playlists through streaming services.
          </p>
        </div>

        <button
          onClick={handleScroll}
          className="
            border-2 border-[#FAFAF9] 
            text-[#395D28] text-5xl font-medium tracking-wide
            bg-linear-to-r from-[#F0F6EE] to-[#99F53D] 
            w-fit 
            self-center
            mt-[30vh]
            px-10 py-3 
            rounded-full 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.20)] 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5"
        >
          Start
        </button>
      </div>

      <img
        src={greenEllipse}
        className="absolute w-screen self-center top-90 h-lvh -z-10"
      />

      <section className="h-dvh" ref={connectPageRef}>
        <svg
          width="100vw"
          height="600"
          className="absolute left-0 right-0 -z-10"
        >
          <defs>
            <linearGradient id="Gradient1" x1={0} x2={0} y1={1} y2={0}>
              <stop offset="0%" stopColor="#fafaf9" />
              <stop offset="100%" stopColor="#fafaf990" />
            </linearGradient>
          </defs>
          <rect
            width="100vw"
            height="600"
            fill="url(#Gradient1)"
            rx="10"
            ry="10"
          />
        </svg>
        <Connect />
      </section>

      <section className="border h-dvh" ref={transferPageRef}>
        <Transfer />
      </section>
    </div>
  );
}

export default App;
