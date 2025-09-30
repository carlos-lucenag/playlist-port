import { useState, useEffect, useCallback } from "react";

function Connect() {
  const [isConnectedSpotify, setIsConnectedSpotify] = useState(null);
  const [isConnectedYoutube, setIsConnectedYoutube] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);

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

  const checkConnections = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    try {
      const [spotify, youtube] = await Promise.all([
        checkSpotifyConnection(),
        checkYoutubeConnection(),
      ]);
      setIsConnectedSpotify(spotify);
      setIsConnectedYoutube(youtube);

      if (isConnectedSpotify === true && isConnectedYoutube === true)
        window.location.href = "http://localhost:5173/transfer";
    } catch (err) {
      console.error("checkConnections error", err);
      setError("Failed to check connections");
    } finally {
      setIsChecking(false);
    }
  }, [
    checkSpotifyConnection,
    checkYoutubeConnection,
    isConnectedSpotify,
    isConnectedYoutube,
  ]);

  useEffect(() => {
    (async () => {
      await checkConnections();
    })();

    const onFocus = async () => {
      await checkConnections();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [checkConnections]);

  return (
    <div>
      <div className="mt-16 bg-[#0D0D0D] h-[24rem] w-[32rem] rounded-[6rem] flex flex-col items-center justify-evenly text-[#E6E6E6]">
        <p className="text-4xl font-medium text-center">
          Connect your<br></br>accounts
        </p>
        <div className="grid gap-5 text-2xl text-[#808080]">
          <button
            className={`w-32 h-12 rounded-full border-2 border-[#808080] hover:text-[#CCCCCC] hover:border-[#CCCCCC] focus:outline-none transition-shadow ${
              isConnectedSpotify
                ? "ring-2 ring-[#33CC33] ring-opacity-60"
                : "bg-neutral-800"
            }`}
            onClick={handleConnectSpotify}
          >
            Spotify
          </button>
          <button
            className={`w-32 h-12 rounded-full border-2 border-[#808080] hover:text-[#CCCCCC] hover:border-[#CCCCCC] focus:outline-none transition-shadow ${
              isConnectedYoutube
                ? "ring-2 ring-[#33CC33] ring-opacity-60"
                : "bg-neutral-800"
            }`}
            onClick={handleConnectYoutube}
          >
            Youtube
          </button>
        </div>

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default Connect;
