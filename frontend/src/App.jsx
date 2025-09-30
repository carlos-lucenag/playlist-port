import { Routes, Route, BrowserRouter } from "react-router-dom";
import Connect from "./components/Connect";
import Transfer from "./components/Transfer";

function App() {
  return (
    <BrowserRouter>
      <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
        <div id="navbar" className="mt-16 mb-20 text-center text-[#E6E6E6]">
          <h1 className="text-6xl font-medium mb-6 tracking-wide">
            Playlist Port
          </h1>
          <p className="text-xl">
            Transfer your playlists through streaming services.
          </p>
        </div>

        <Routes>
          <Route path="/" element={<Connect />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes>
      
      </div>
    </BrowserRouter>
  );
}

export default App;
