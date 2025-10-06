function Connect() {
  const handleConnectSpotify = () => {
    window.open("http://localhost:3000/login/spotify", "_blank");
  };

  const handleConnectYoutube = () => {
    window.open("http://localhost:3000/login/youtube", "_blank");
  };

  return (
    <div className="mt-40 flex flex-col">
      <h1 className="text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        1. Connect
      </h1>
      <p className="mt-5 text-3xl text-[#636B61] italic">To your accounts</p>

      <div className="grid mt-[20vh] gap-5 self-center text-3xl text-[#395D28]">
        <button
          onClick={handleConnectYoutube}
          className="
            border-2 border-[#FAFAF9] 
            bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
            w-48 
            px-4 py-2 
            rounded-full 
            text-3xl font-medium tracking-wide 
            self-center 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5"
        >
          Youtube
        </button>
        <button
          onClick={handleConnectSpotify}
          className="
            border-2 border-[#FAFAF9] 
            bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
            w-48 
            px-4 py-2 
            rounded-full 
            text-3xl font-medium tracking-wide 
            self-center 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5"
        >
          Spotify
        </button>
      </div>
    </div>
  );
}

export default Connect;
