import { useState } from "react";

function Select() {
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
    <div className="mt-40 flex flex-col">
      <h1 className="text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        2. Select
      </h1>
      <p className="mt-5 text-3xl text-[#636B61] italic">
        Origin and destination
      </p>

      <form className="mt-[20vh] grid gap-10 self-center">
        <div className="flex gap-7 items-center">
          <p className="text-4xl font-medium w-30 text-right">From:</p>
          <select
            name="origin"
            id="origin-service"
            required
            value={formData.origin}
            onChange={handleChange}
            className="
              border-2 border-[#FAFAF9] 
              text-[#395D28] font-medium tracking-wide
              bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
              rounded-full 
              shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
              px-6 py-2
              cursor-pointer
              text-center text-2xl 
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

        <div className="flex gap-7 items-center">
          <p className="text-4xl font-medium w-30 text-right">To:</p>
          <select
            name="destination"
            id="destination-service"
            required
            value={formData.destination}
            onChange={handleChange}
            className="
              border-2 border-[#FAFAF9] 
              text-[#395D28] font-medium tracking-wide
              bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
              rounded-full 
              shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
              px-6 py-2
              cursor-pointer
              text-center text-2xl 
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
  );
}

export default Select;
