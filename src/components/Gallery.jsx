import React from 'react';

export default function Gallery({ mediaItems }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      {mediaItems.length === 0 ? (
        <p>No media captured yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="border p-2">
              {item.type === 'photo' ? (
                <img src={item.src} alt="Captured" className="w-full h-auto" />
              ) : (
                <video src={item.src} controls className="w-full h-auto" />
              )}
              {item.type === 'photo' && item.processed && (
                <a
                  href={item.src}
                  download={`processed-${item.id}.png`}
                  className="inline-block mt-2 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Download PNG
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}