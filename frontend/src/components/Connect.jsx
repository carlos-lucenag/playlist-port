function Connect() {
  const handleConnectSpotify = () => {
    window.location.href = "http://localhost:3000/login/spotify";
  };

  const handleConnectYoutube = () => {
    window.location.href = "http://localhost:3000/login/youtube";
  };

  return (
    <div>
      <div className="place-self-center bg-neutral-900 h-[22rem] w-[26rem] rounded-4xl flex flex-col items-center justify-evenly text-neutral-100 shadow-lg xs:mb-28">
        <p className="text-4xl font-medium text-center">
          Connect your<br></br>accounts
        </p>
        <div className="grid gap-5">
          <button
            className="bg-neutral-800 hover:bg-neutral-700 border w-26 px-2 py-1 rounded-full text-center text-xl"
            onClick={handleConnectSpotify}
          >
            Spotify
          </button>
          <button
            className="bg-neutral-800 hover:bg-neutral-700 border w-26 px-2 py-1 rounded-full text-center text-xl"
            onClick={handleConnectYoutube}
          >
            Youtube
          </button>
        </div>
      </div>
    </div>
  );
}

export default Connect;
