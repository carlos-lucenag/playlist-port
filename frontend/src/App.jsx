import React, { useRef } from "react";
import Connect from "./components/Connect";
import Select from "./components/Select";
import Transfer from "./components/Transfer";
import greenEllipse from "./assets/green-ellipse.svg";
import githubIcon from "./assets/icon-github.svg";
import linkedinIcon from "./assets/icon-linkedin.svg";
import gmailIcon from "./assets/icon-gmail.svg";

function App() {
  const connectPageRef = useRef(null);
  const selectPageRef = useRef(null);
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
        <div id="navbar" className="mt-40">
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
            rounded-full 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.20)] 
            w-fit 
            self-center
            mt-[25vh]
            px-10 py-3 
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

      <section className="h-dvh" ref={selectPageRef}>
        <Select />
      </section>

      <section className="h-dvh" ref={transferPageRef}>
        <Transfer />
      </section>

      <div className="bg-[#131612] rounded-t-[4rem] shadow-[0px_-8px_32px_rgba(19,22,18,0.4)] w-screen h-[calc(100vh/4)] px-[60rem] self-center flex items-center justify-between">
        <p
          className="
            text-3xl text-transparent 
            font-medium
            bg-clip-text bg-linear-to-r 
            from-[#99F53D50] to-[#99f53dcc] 
            text-shadow-[0px_0px_16px_rgba(153,245,61,0.2)]
          "
        >
          Made by @carloslucena
        </p>
        <div className="flex gap-2">
          <a href="https://github.com/carlos-lucenag" target="_blank">
            <img src={githubIcon} alt="" srcset="" />
          </a>
          <a
            href="https://www.linkedin.com/in/carlosgoncalvesctt/"
            target="_blank"
          >
            <img src={linkedinIcon} alt="" srcset="" />
          </a>
          <a href="mailto:carlosgoncalves.ctt@gmail.com">
            <img src={gmailIcon} alt="" srcset="" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
