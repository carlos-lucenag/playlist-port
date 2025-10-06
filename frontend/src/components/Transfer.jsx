function Transfer() {
  return (
    <div className="mt-40 flex flex-col">
      <h1 className="text-6xl text-[#181C17] text-shadow-md font-bold tracking-wide">
        3. Paste
      </h1>
      <p className="mt-5 text-3xl text-[#636B61] italic">Your playlist URL</p>
      <form className="flex flex-col">
        <input
          type="text"
          name="playlistUrl"
          id="playlistUrl-input"
          className="
            mt-[20vh]
            w-full h-14 
            px-8 py-4
            text-xl
            rounded-full 
            bg-[#F0F6EE] 
            border-2 border-[#395D28]
            shadow-[0_2px_6px_rgba(220,240,180,0.7)]
            focus:outline-none
            focus:shadow-[0_2px_24px_rgba(220,240,180,0.7)]"
        />
        <button
          className="
            border-2 border-[#FAFAF9] 
            text-[#395D28] text-4xl font-medium tracking-wide
            bg-linear-to-r from-[#F0F6EE] to-[#99F53D] 
            rounded-full 
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_4px_8px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.20)] 
            w-fit 
            self-center
            mt-[16vh]
            px-10 py-3 
            transform transition-all duration-200 ease-in-out 
            hover:-translate-y-0.5"
        >
          Transfer
        </button>
      </form>
    </div>
  );
}

export default Transfer;
