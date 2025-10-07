import { useState } from "react";

function Connect({ selectPageRef }) {
  const [isConnectedSpotify, setIsConnectedSpotify] = useState(false);
  const [isConnectedYoutube, setIsConnectedYoutube] = useState(false);

  const handleNext = () => {
    selectPageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleConnectSpotify = async () => {
    const width = 500,
      height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "http://localhost:3000/login/spotify",
      "SpotifyLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") return;
      if (e.data.type === "spotify-auth") {
        setIsConnectedSpotify(true);
        popup?.close();
      }
    });
  };

  const handleConnectYoutube = () => {
    const width = 500,
      height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "http://localhost:3000/login/youtube",
      "YoutubeLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") return;
      if (e.data.type === "youtube-auth") {
        setIsConnectedYoutube(true);
        popup?.close();
      }
    });
  };

  return (
    <div className="mt-[14vh] flex flex-col">
      <h1 className="text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        1. Connect
      </h1>
      <p className="mt-5 text-3xl text-[#636B61] italic">To your accounts</p>

      <div className="grid mt-[20vh] gap-5 self-center text-3xl text-[#395D28]">
        <button
          onClick={handleConnectYoutube}
          className={`
            border-2 border-[#FAFAF9] 
            bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
            w-48 
            px-4 py-2 
            rounded-full 
            text-3xl font-medium tracking-wide 
            self-center 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5
            ${
              isConnectedYoutube
                ? "border-2 border-green-300"
                : "border-2 border-[#FAFAF9]"
            }`}
        >
          Youtube
        </button>
        <button
          onClick={handleConnectSpotify}
          className={`
            border-2 border-[#FAFAF9] 
            bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
            w-48 
            px-4 py-2 
            rounded-full 
            text-3xl font-medium tracking-wide 
            self-center 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5
            ${
              isConnectedSpotify
                ? "border-2 border-green-300"
                : "border-2 border-[#FAFAF9]"
            }`}
        >
          Spotify
        </button>
      </div>

      {isConnectedSpotify && isConnectedYoutube && (
        <button
          onClick={handleNext}
          className="
            w-fit h-12 
            self-center 
            mt-24 
            shadow-md
            bg-[#99F53D70] text-[#395D28] 
            font-bold text-xl
            rounded-full
            px-8 py-2
            transform transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:shadow-lg
            hover:bg-[#99F53D90]
            animate-[slideUp_0.5s_ease-out]
          "
          style={{
            animation: "slideUp 0.5s ease-out",
          }}
        >
          Next →
        </button>
      )}
    </div>
  );
}

export default Connect;
