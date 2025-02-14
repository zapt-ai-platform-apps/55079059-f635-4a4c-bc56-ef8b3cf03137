import { useEffect, useRef, useState } from 'react';
import { removeBackground } from '../utilities/backgroundRemoval';
import * as Sentry from '@sentry/browser';

function useCamera(addMedia) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function initCamera() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: true
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
        console.log('Camera stream initialized.');
      } catch (error) {
        console.error('Error accessing camera:', error);
        Sentry.captureException(error);
      }
    }
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = async (withBgRemoval = false) => {
    if (!videoRef.current) return;
    setProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let imageDataUrl = canvas.toDataURL('image/png');
      console.log('Photo captured.');
      if (withBgRemoval) {
        console.log('Starting background removal process.');
        imageDataUrl = await removeBackground(imageDataUrl);
        console.log('Background removal completed.');
      }
      addMedia({ type: 'photo', src: imageDataUrl, processed: withBgRemoval });
    } catch (error) {
      console.error('Error capturing photo:', error);
      Sentry.captureException(error);
    } finally {
      setProcessing(false);
    }
  };

  const startRecording = () => {
    if (stream && !recording) {
      try {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setRecordedChunks((prev) => [...prev, e.data]);
          }
        };
        mediaRecorder.onstart = () => {
          console.log('Video recording started.');
        };
        mediaRecorder.onstop = () => {
          console.log('Video recording stopped.');
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          addMedia({ type: 'video', src: videoUrl });
          setRecordedChunks([]);
        };
        mediaRecorder.start();
        setRecording(true);
      } catch (error) {
        console.error('Error starting video recording:', error);
        Sentry.captureException(error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return { videoRef, processing, recording, capturePhoto, startRecording, stopRecording };
}

export default useCamera;