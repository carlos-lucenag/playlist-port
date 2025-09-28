import { Routes, Route, BrowserRouter } from "react-router-dom";
import Connect from "./components/Connect";
import Transfer from "./components/Transfer";

function App() {
  return (
    <BrowserRouter>
      <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
        <div id="navbar" className="mt-20 mb-20 text-center">
          <h1 className="text-7xl font-medium mb-6 text-neutral-50 tracking-wide">
            Playlist Port
          </h1>
          <p className="text-2xl xs:text-xl text-neutral-200">
            Transfer your playlists through streaming services.
          </p>
        </div>

        <Routes>
          <Route path="/" element={<Connect />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes>

        <div
          id="footer"
          className="relative bottom-0 mt-20 w-lvw py-5 text-center bg-neutral-800/90 grid gap-3 justify-center"
        >
          <p className="my-5 text-xl text-neutral-400">
            Thanks for visiting!
          </p>
          <p className="text-xl text-neutral-400">
            Connect with me at:
          </p>
          <div className="flex justify-around w-sm px-10 text-emerald-300/65">
            <a href="https://github.com/carlos-lucenag" target="_blank">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/carlosgoncalvesctt/" target="_blank">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
