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
        `http://localhost:3000/transfer/youtube/${playlistId}`,
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
        return;
      }

      if (!response.ok)
        throw new Error("Failed to transfer playlist, please try again.");

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
        `http://localhost:3000/transfer/spotify/${playlistId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistId }),
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("Failed to transfer playlist, please try again.");

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
      <div className="py-40 relative bottom-0 w-screen flex flex-col">
        <div className="text-[#181C17] ml-64 w-fit">
          <h1 className="text-6xl text-shadow-md font-bold tracking-wide mb-5">
            2. Select
          </h1>
          <p className="text-3xl italic text-shadow-xs text-[#636B61]">
            Origin and destination
          </p>
        </div>
        <div className="flex flex-col">
          <form className="border self-center w-80">
            <div className="flex gap-10">
              <p className="text-4xl font-medium">From:</p>
              <select
                name="origin"
                id="origin-service"
                required
                value={formData.origin}
                onChange={handleChange}
                className="
              cursor-pointer
              w-24 h-10 
              text-center text-xl 
              bg-neutral-200 text-[#000000] 
              rounded-full 
              border-2 border-[#808080] 
              focus:outline-none 
              "
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="spotify">Spotify</option>
                <option value="youtube">Youtube</option>
              </select>
            </div>
            <div className="flex gap-10 border">
              <p className="text-4xl font-medium">To:</p>
              <select
                name="origin"
                id="origin-service"
                required
                value={formData.origin}
                onChange={handleChange}
                className="
              cursor-pointer
              w-24 h-10 
              text-center text-xl 
              bg-neutral-200 text-[#000000] 
              rounded-full 
              border-2 border-[#808080] 
              focus:outline-none 
              "
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="spotify">Spotify</option>
                <option value="youtube">Youtube</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
