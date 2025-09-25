import { useState } from "react";

function Transfer() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    playlistUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [error, setError] = useState(null);

  const extractPlaylistId = (playlistUrl) => {
    let playlistId = "";
    switch (formData.origin) {
      case "spotify":
        playlistId = playlistUrl.slice(-22);
        break;
      case "youtube":
        playlistId = playlistUrl.slice(-34);
    }
    return playlistId;
  };

  const transferToYoutube = async (playlistId) => {
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

      // Se não estiver autenticado.
      if (response.status === 401) {
        const data = await response.json();
        window.location.href = data.redirectUrl;
        return
      }
      
      if (!response.ok) throw new Error("Failed to transfer playlist, please try again.");
      
      const data = await response.json();
      setTransferResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const transferToSpotify = async (playlistId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/transferToSpotify/${playlistId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistId }),
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to transfer playlist, please try again.");
      
      const data = await response.json();
      setTransferResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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

    let playlistUrl = formData.playlistUrl;
    let playlistId = extractPlaylistId(playlistUrl);

    if (formData.destination === "youtube") {
      transferToYoutube(playlistId);
    } else if (formData.destination === "spotify") {
      transferToSpotify(playlistId);
    }
  };

  return (
    <div>
      <form className="place-self-center w-5xl flex justify-between items-center xs:w-xl xs:flex-col">
        <div className="bg-neutral-900 h-[22rem] w-[26rem] rounded-4xl flex flex-col items-center justify-evenly text-neutral-100 shadow-lg xs:mb-28">
          <p className="text-4xl font-medium text-center">
            Select origin<br></br>and destination
          </p>
          <div className="w-xs p-2">
            <div className="flex items-center justify-evenly mb-10">
              <p className="text-2xl w-20 text-center">From</p>
              <select
                name="origin"
                id="origin-service"
                required
                value={formData.origin}
                onChange={handleChange}
                className="
                  appearance-none 
                  text-center text-xl 
                  bg-neutral-800 text-neutral-300 
                  px-2.5 py-2 
                  rounded-full 
                  border-2 border-neutral-800 
                  hover:bg-neutral-700
                  focus:outline-none focus:ring-0 focus:border-neutral-500
                "
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
                name="destination"
                id="destination-service"
                required
                value={formData.destination}
                onChange={handleChange}
                className="
                  appearance-none 
                  text-center text-xl 
                  bg-neutral-800 text-neutral-300 
                  px-2.5 py-2 
                  rounded-full 
                  border-2 border-neutral-800 
                  hover:bg-neutral-700
                  focus:outline-none focus:ring-0 focus:border-neutral-500
                "
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

        <div className="bg-neutral-900 h-[22rem] w-[26rem] rounded-4xl flex flex-col items-center justify-evenly text-neutral-100 shadow-lg xs:mb-20">
          <p className="text-4xl font-medium text-center w-xs">
            Paste your<br></br>playlist URL
          </p>
          <input
            type="text"
            name="playlistUrl"
            placeholder="Paste your playlist's URL"
            className="bg-neutral-700 text-xs py-2 px-4 rounded-full w-xs focus:outline-none focus:bg-neutral-600"
            value={formData.playlistUrl}
            onChange={handleChange}
            required
          />

          <div className="p-1 rounded-full bg-linear-to-r from-[#40BF40] to-[#7266CC]">
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="text-xl font-medium w-30 bg-neutral-800/50 hover:bg-neutral-500/30 p-2 rounded-full shadow-lg"
            >
              {isLoading ? "Transferring..." : "Transfer"}
            </button>
          </div>

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
      </form>
    </div>
  );
}

export default Transfer;
