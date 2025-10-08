function Select({ transferData, setTransferData, transferPageRef }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = () => {
    transferPageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="mt-24 md:mt-40 flex flex-col">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        2. Select
      </h1>
      <p className="mt-3 md:mt-5 text-xl sm:text-2xl md:text-3xl text-[#636B61] italic">
        Origin and destination
      </p>

      <form className="mt-[12vh] md:mt-[20vh] grid gap-6 md:gap-10 self-center">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-7 items-center">
          <p className="text-2xl sm:text-3xl md:text-4xl font-medium w-full sm:w-24 md:w-30 text-center sm:text-right">From:</p>
          <select
            name="origin"
            id="origin-service"
            required
            value={transferData.origin}
            onChange={handleChange}
            className={`border-2 border-[#FAFAF9] 
              text-[#395D28] font-medium tracking-wide
              bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
              rounded-full 
              shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
              px-4 py-2 sm:px-5 md:px-6
              cursor-pointer
              text-center text-lg sm:text-xl md:text-2xl 
              focus:outline-none 
              w-full sm:w-auto
              ${
                transferData.origin !== ""
                  ? "border-green-400"
                  : "border-[#fafaf9]"
              }`}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="spotify">Spotify</option>
            <option value="youtube">Youtube</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-7 items-center">
          <p className="text-2xl sm:text-3xl md:text-4xl font-medium w-full sm:w-24 md:w-30 text-center sm:text-right">To:</p>
          <select
            name="destination"
            id="destination-service"
            required
            value={transferData.destination}
            onChange={handleChange}
            className={`border-2 border-[#FAFAF9] 
              text-[#395D28] font-medium tracking-wide
              bg-linear-to-r from-[#F0F6EE03] to-[#D9FBB6] 
              rounded-full 
              shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)] 
              px-4 py-2 sm:px-5 md:px-6
              cursor-pointer
              text-center text-lg sm:text-xl md:text-2xl 
              focus:outline-none 
              w-full sm:w-auto
              ${
                transferData.destination !== ""
                  ? "border-green-400"
                  : "border-[#fafaf9]"
              }`}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="spotify">Spotify</option>
            <option value="youtube">Youtube</option>
          </select>
        </div>
      </form>

      {transferData.origin && transferData.destination && (
        <button
          onClick={handleNext}
          className="
            w-fit h-10 md:h-12 
            self-center 
            mt-16 md:mt-24 
            shadow-md
            bg-[#99F53D70] text-[#395D28] 
            font-bold text-lg md:text-xl
            rounded-full
            px-6 py-2 md:px-8
            transform transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:shadow-lg
            hover:bg-[#99F53D90]
            animate-[slideUp_0.5s_ease-out]
          "
          style={{
            animation: "slideUp 0.5s ease-out",
          }}
        >
          Next →
        </button>
      )}
    </div>
  );
}

export default Select;
