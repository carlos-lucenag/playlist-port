import { useState } from "react";

function Transfer({ BACKEND_URL, transferData, setTransferData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [error, setError] = useState(null);

  const extractPlaylistId = (playlistUrl) => {
    let playlistId = "";

    const spRegex = /(?:playlist\/|playlist:)([A-Za-z0-9]{22})/;
    const ytRegex = /[?&]list=([A-Za-z0-9_-]+)/;

    switch (transferData.origin) {
      case "spotify":
        const spMatch = playlistUrl.match(spRegex);
        playlistId = spMatch ? spMatch[1] : null;
        break;
      case "youtube":
        const ytMatch = playlistUrl.match(ytRegex);
        playlistId = ytMatch ? ytMatch[1] : null;
        break;
      default:
        console.warn("⚠️ origem desconhecida:", transferData.origin);
        playlistId = null;
    }

    console.log("playlistId:", playlistId);
    return playlistId;
  };

  const transferPlaylist = async (playlistId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: transferData.origin,
          destination: transferData.destination,
          playlistId: playlistId,
        }),
        credentials: "include",
      });

      if (response.status === 401) {
        const data = await response.json();
        setError(data.message || "Authentication required.");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to transfer playlist.");
      }

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
    setTransferData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTransferResult(null);
    setError(null);

    console.log("playlist url:", transferData.playlistUrl);

    const playlistId = extractPlaylistId(transferData.playlistUrl);

    console.log("post playlistId:", playlistId);

    await transferPlaylist(playlistId);
  };

  return (
    <div className="mt-[10vh] md:mt-[14vh] flex flex-col">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        3. Paste
      </h1>
      <p className="mt-3 md:mt-5 text-xl sm:text-2xl md:text-3xl text-[#636B61] italic">
        Your playlist URL
      </p>
      <form className="flex flex-col" onSubmit={handleTransfer}>
        <input
          type="text"
          name="playlistUrl"
          id="playlistUrl-input"
          value={transferData.playlistUrl}
          onChange={handleChange}
          placeholder="https://..."
          required
          className="
            mt-[10vh] md:mt-[16vh]
            w-full h-12 md:h-14 
            px-4 py-3 md:px-8 md:py-4
            text-base md:text-xl
            rounded-full 
            bg-[#F0F6EE] 
            border-2 border-[#395D28]
            shadow-[0_2px_6px_rgba(220,240,180,0.1)]
            focus:outline-none
            focus:shadow-[0_2px_24px_rgba(220,240,180,0.7)]"
        />
        <button
          type="submit"
          disabled={
            isLoading || !transferData.origin || !transferData.destination
          }
          className="
            border-2 border-[#FAFAF9] 
            text-[#395D28] text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide
            bg-linear-to-r from-[#F0F6EE] to-[#99F53D] 
            rounded-full 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.20)] 
            w-fit 
            self-center
            mt-[10vh] md:mt-[14vh]
            px-6 py-2 sm:px-8 sm:py-2.5 md:px-10 md:py-3 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Transferring..." : "Transfer"}
        </button>

        {error && (
          <p className="text-red-500 text-sm md:text-base text-center mt-4">
            {error}
          </p>
        )}

        {transferResult && (
          <div className="text-center mt-4">
            <p className="text-green-600 font-semibold mb-2 text-sm md:text-base">
              Playlist transferred successfully!
            </p>
            {transferResult.url && (
              <a
                href={transferResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#395D28] underline hover:text-[#99f53d] text-sm md:text-base"
              >
                Open new playlist
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default Transfer;
