import React from 'react';
import useCamera from '../hooks/useCamera';

export default function Camera({ addMedia }) {
  const { videoRef, processing, recording, capturePhoto, startRecording, stopRecording } = useCamera(addMedia);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-full max-w-4xl mb-4"
        autoPlay
        playsInline
      />
      <div className="flex gap-4">
        <button
          onClick={() => capturePhoto(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Capture Photo'}
        </button>
        <button
          onClick={() => capturePhoto(true)}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Capture Photo with BG Removal'}
        </button>
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}