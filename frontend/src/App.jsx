import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import Connect from "./components/Connect";
import Transfer from "./components/Transfer";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
