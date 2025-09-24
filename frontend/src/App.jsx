import { useRef, useState } from "react";

function App() {
  const transferSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    playlistUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTransferResult(null);
    setError(null);

    if (formData.origin === "spotify" && formData.destination === "youtube") {
      const playlistId = getPlaylistId(formData.playlistUrl);

      if (!playlistId) {
        setError("Invalid playlist URL.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/transferToYoutube/${playlistId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ playlistId }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to transfer playlist, please try again.");
        }

        const data = await response.json();
        setTransferResult(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleScrollToTransfer = () => {
    transferSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPlaylistId = (url) => {
    try {
      const urlObject = new URL(url);
      const pathParts = urlObject.pathname.split("/");
      const playlistIndex = pathParts.findIndex((part) => part === "playlist");
      if (playlistIndex !== -1 && pathParts[playlistIndex + 1]) {
        return pathParts[playlistIndex + 1];
      }
      return null;
    } catch (error) {
      console.error("Invalid URL format", error);
      return null;
    }
  };

  return (
    <div>
      
      <div id="navbar" className="mt-28 mb-28 text-center">
        <h1 className="text-8xl mb-10 text-neutral-50 tracking-wide">Playlist Port</h1>
        <p className="text-3xl text-neutral-200">
          Transfer your playlists through streaming services.
        </p>
      </div>

      <div className="place-self-center rounded-4xl w-5xl flex justify-between items-center">
        <div className="bg-neutral-900 h-[22rem] w-[26rem] rounded-4xl flex flex-col items-center justify-evenly text-neutral-100 shadow-lg">
          <p className="text-4xl text-center">Select origin<br></br>and destination</p>
          <div className="w-xs p-2">
            <div className="flex items-center justify-evenly mb-10">
              <p className="text-2xl w-20 text-center">From</p>
              <select
                name="origin"
                id="origin-service"
                required
                value={formData.origin}
                onChange={handleChange}
                className="text-center text-xl bg-neutral-700 text-neutral-500 p-2 rounded-full"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="spotify">Spotify</option>
                <option value="youtube">Youtube</option>
              </select>
            </div>
            <div className="flex items-center justify-evenly">
              <p className="text-2xl w-20 text-center">To</p>
              <select
                name="origin"
                id="origin-service"
                required
                value={formData.origin}
                onChange={handleChange}
                className="text-center text-xl bg-neutral-700 text-neutral-500 p-2 rounded-full"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="spotify">Spotify</option>
                <option value="youtube">Youtube</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 h-[22rem] w-[26rem] rounded-4xl flex flex-col items-center justify-evenly text-neutral-100 shadow-lg">
          <p className="text-4xl text-center w-xs">Paste your<br></br>playlist URL</p>
          <input
            type="text"
            name="playlistUrl"
            placeholder="Paste your playlist's URL"
            className="bg-neutral-700 text-md py-2 px-4 rounded-full w-xs"
            value={formData.playlistUrl}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="text-xl w-30 bg-linear-to-r from-[#40BF40] to-[#7266CC] p-2 rounded-full"
          >
            {isLoading ? "Transferring..." : "Transfer"}
          </button>
          {transferResult && (
            <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
              <p>Success! Your new playlist is here:</p>
              <a
                href={transferResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                {transferResult.url}
              </a>
            </div>
          )}
          {error && (
            <div className="mt-4 p-2 bg-red-200 text-red-800 rounded">
              <p>Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
