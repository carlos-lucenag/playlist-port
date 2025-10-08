import { useState } from "react";

function Transfer({ transferData, setTransferData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [error, setError] = useState(null);

  const extractPlaylistId = (playlistUrl) => {
    let playlistId = "";
    switch (transferData.origin) {
      case "spotify":
        playlistId = playlistUrl.slice(-22);
        break;
      case "youtube":
        playlistId = playlistUrl.slice(-34);
        break;
    }
    return playlistId;
  };

  const transferPlaylist = async (playlistId) => {
    try {
      const response = await fetch("http://localhost:3000/transfer", {
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

    const playlistId = extractPlaylistId(transferData.playlistUrl);
    await transferPlaylist(playlistId);
  }

  return (
    <div className="mt-[14vh] flex flex-col">
      <h1 className="text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        3. Paste
      </h1>
      <p className="mt-5 text-3xl text-[#636B61] italic">Your playlist URL</p>
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
            mt-[16vh]
            w-full h-14 
            px-8 py-4
            text-xl
            rounded-full 
            bg-[#F0F6EE] 
            border-2 border-[#395D28]
            shadow-[0_2px_6px_rgba(220,240,180,0.1)]
            focus:outline-none
            focus:shadow-[0_2px_24px_rgba(220,240,180,0.7)]"
        />
        <button
          type="submit"
          disabled={isLoading || !transferData.origin || !transferData.destination}
          className="
            border-2 border-[#FAFAF9] 
            text-[#395D28] text-4xl font-medium tracking-wide
            bg-linear-to-r from-[#F0F6EE] to-[#99F53D] 
            rounded-full 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.20)] 
            w-fit 
            self-center
            mt-[14vh]
            px-10 py-3 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Transferring..." : "Transfer"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
        
        {transferResult && (
          <div className="text-center mt-4">
            <p className="text-green-600 font-semibold mb-2">
              Playlist transferred successfully!
            </p>
            {transferResult.url && (
              <a
                href={transferResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#395D28] underline hover:text-[#99f53d]"
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
