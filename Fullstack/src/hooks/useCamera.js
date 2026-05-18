import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing camera access and photo capture
 */
const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' | 'environment'

  /** Start the camera stream */
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsActive(true);
      setHasPermission(true);
    } catch (err) {
      let message = 'Tidak dapat mengakses kamera.';
      if (err.name === 'NotAllowedError') {
        message = 'Akses kamera ditolak. Izinkan akses kamera di pengaturan browser.';
      } else if (err.name === 'NotFoundError') {
        message = 'Kamera tidak ditemukan pada perangkat ini.';
      } else if (err.name === 'NotReadableError') {
        message = 'Kamera sedang digunakan oleh aplikasi lain.';
      }
      setError(message);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  /** Stop the camera stream */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  /** Capture a frame from the live video */
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];

    return { dataUrl, base64 };
  }, []);

  /** Toggle between front and back camera */
  const toggleCamera = useCallback(async () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, [stopCamera]);

  /** Check if camera API is available */
  const isCameraAvailable = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  // Restart camera when facingMode changes
  useEffect(() => {
    if (isActive) {
      startCamera();
    }
  }, [facingMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isActive,
    isLoading,
    error,
    hasPermission,
    facingMode,
    isCameraAvailable,
    startCamera,
    stopCamera,
    capturePhoto,
    toggleCamera,
  };
};

export default useCamera;
