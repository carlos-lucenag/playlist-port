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

      if (isConnectedSpotify && isConnectedYoutube)
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
      <div className="bg-neutral-900 h-[22rem] w-[26rem] rounded-4xl flex flex-col items-center justify-evenly text-neutral-100 shadow-lg xs:mb-28">
        <p className="text-4xl font-medium text-center">
          Connect your<br></br>accounts
        </p>
        <div className="grid gap-5">
          <button
            className={`px-4 py-2 rounded-full text-xl focus:outline-none transition-shadow ${
              isConnectedSpotify
                ? "ring-4 ring-green-400 ring-opacity-60"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
            onClick={handleConnectSpotify}
          >
            Spotify
          </button>
          <button
            className={`px-4 py-2 rounded-full text-xl focus:outline-none transition-shadow ${
              isConnectedYoutube
                ? "ring-4 ring-green-400 ring-opacity-60"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
            onClick={handleConnectYoutube}
          >
            Youtube
          </button>
        </div>

        {isChecking && (
          <p className="text-sm text-neutral-300 mt-2">
            Checking connections...
          </p>
        )}

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default Connect;
