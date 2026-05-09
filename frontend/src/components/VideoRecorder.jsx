import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

const VideoRecorder = ({ isRecording }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false // Audio handled separately
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please allow camera permissions.');
      setHasPermission(false);
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleVideo = async () => {
      if (isRecording && isMounted) {
        await startVideo();
      } else if (!isRecording && isMounted) {
        stopVideo();
      }
    };

    handleVideo();

    return () => {
      isMounted = false;
      stopVideo();
    };
  }, [isRecording]);

  return (
    <div className="relative">
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {hasPermission ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-800">
            <div className="text-center text-gray-400">
              {error ? (
                <div>
                  <CameraOff size={48} className="mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div>
                  <Camera size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Camera not active</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && hasPermission && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Recording</span>
        </div>
      )}

      {/* Permission status */}
      {!hasPermission && !error && (
        <div className="absolute bottom-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
          Camera permission required
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;