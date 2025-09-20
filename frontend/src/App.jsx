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
    <>
      <div className="h-screen bg-slate-400 flex flex-col justify-center items-center text-center">
        <div id="navbar" className="mb-10">
          <h1 className="mb-3 text-5xl">Playlist Port</h1>
          <p className="text-xl">
            Transfer your playlists through streaming services.
          </p>
        </div>
        <button
          onClick={handleScrollToTransfer}
          className="cursor-pointer mt-14 text-3xl justify-self-center bg-slate-300 border w-fit h-fit px-6 py-3 rounded-2xl hover:bg-slate-200"
        >
          Start
        </button>
      </div>

      <form
        ref={transferSectionRef}
        onSubmit={handleSubmit}
        className="h-screen bg-slate-500 flex flex-col justify-center items-center text-center"
      >
        <p>Transfer from</p>
        <select
          name="origin"
          id="origin-service"
          required
          value={formData.origin}
          onChange={handleChange}
          className="mt-3 text-center bg-slate-400 p-2 rounded"
        >
          <option value="" disabled>
            Select
          </option>
          <option value="spotify">Spotify</option>
          <option value="youtube">Youtube</option>
        </select>
        <p className="mt-6">To</p>
        <select
          name="destination"
          id="destination-service"
          required
          value={formData.destination}
          onChange={handleChange}
          className="mt-3 text-center bg-slate-400 p-2 rounded"
        >
          <option value="" disabled>
            Select
          </option>
          <option value="spotify">Spotify</option>
          <option value="youtube">Youtube</option>
        </select>
        <input
          type="text"
          name="playlistUrl"
          placeholder="Paste your playlist's URL"
          className="bg-slate-200 p-2 rounded-2xl mt-5"
          value={formData.playlistUrl}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 bg-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200"
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
      </form>
    </>
  );
}

export default App;
