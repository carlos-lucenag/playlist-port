import { useState, useEffect, useCallback } from "react";

function Connect() {
  const [isConnectedSpotify, setIsConnectedSpotify] = useState(null);
  const [isConnectedYoutube, setIsConnectedYoutube] = useState(null);

  const checkSpotifyConnection = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/status/spotify", {
        credentials: "include",
      });
      if (response.ok) {
        try {
          const data = await response.json();
          return Boolean(data?.connected ?? true);
        } catch {
          return true;
        }
      }
      console.error(
        "Spotify status check failed",
        response.status,
        await response.text()
      );
      return false;
    } catch (err) {
      console.error("Spotify status check error", err);
      return false;
    }
  }, []);

  const checkYoutubeConnection = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/status/youtube", {
        credentials: "include",
      });
      if (response.ok) {
        try {
          const data = await response.json();
          return Boolean(data?.connected ?? true);
        } catch {
          return true;
        }
      }
      console.error(
        "Youtube status check failed",
        response.status,
        await response.text()
      );
      return false;
    } catch (err) {
      console.error("Youtube status check error", err);
      return false;
    }
  }, []);

  const handleConnectSpotify = () => {
    window.location.href = "http://localhost:3000/login/spotify";
  };

  const handleConnectYoutube = () => {
    window.location.href = "http://localhost:3000/login/youtube";
  };
  
  return (
    <div>
      <div className="py-40 relative bottom-0 w-screen flex flex-col">
        <div className="text-[#181C17] ml-[16%] w-fit">
          <h1 className="text-6xl text-shadow-md font-bold tracking-wide mb-5">
            1. Connect
          </h1>
          <p className="text-3xl italic text-shadow-xs text-[#636B61]">
            To your accounts
          </p>
        </div>

        <div className="grid mt-36 gap-5 self-center text-3xl text-[#395D28]">
          <button
            className={`border-2 border-[#FAFAF9] bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] w-48 px-4 py-2 rounded-full text-3xl self-center font-medium tracking-wide shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] transform transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
              isConnectedYoutube ? " border-[#99F53D]" : "bg-[#F0F6EE]"
            }`}
            onClick={handleConnectYoutube}
          >
            Youtube
          </button>
          <button
            className={`border-2 border-[#FAFAF9] bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] w-48 px-4 py-2 rounded-full text-3xl self-center font-medium tracking-wide shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] transform transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
              isConnectedSpotify ? "border-[#99F53D]" : "bg-[#F0F6EE]"
            }`}
            onClick={handleConnectSpotify}
          >
            Spotify
          </button>
        </div>
      </div>
    </div>
  );
}

export default Connect;
