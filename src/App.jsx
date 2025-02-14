import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Camera from './components/Camera';
import Gallery from './components/Gallery';

export default function App() {
  const [mediaItems, setMediaItems] = useState([]);

  const addMediaItem = (item) => {
    console.log('Adding media item:', item);
    setMediaItems((prev) => [...prev, { id: Date.now(), ...item }]);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">wcamera</h1>
          <nav>
            <Link to="/" className="mr-4 cursor-pointer">Camera</Link>
            <Link to="/gallery" className="cursor-pointer">Gallery</Link>
          </nav>
        </header>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Camera addMedia={addMediaItem} />} />
            <Route path="/gallery" element={<Gallery mediaItems={mediaItems} />} />
          </Routes>
        </main>
        <footer className="bg-gray-100 text-center p-2">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 cursor-pointer">
            Made on ZAPT
          </a>
        </footer>
      </div>
    </Router>
  );
}