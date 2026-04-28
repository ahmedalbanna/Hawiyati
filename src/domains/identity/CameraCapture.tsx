import React, { useRef, useState, useCallback } from "react";
import { Camera, RefreshCw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
}

export const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 400, height: 400 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access failed", err);
      setError("تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الصلاحيات.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism relative overflow-hidden rounded-3xl p-8"
    >
      <button 
        onClick={onCancel}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 hover:bg-white/10"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold">التقاط صورة الهوية</h3>
          <p className="text-xs text-white/40 mt-1">Ensure your face is clearly visible in the frame.</p>
        </div>

        <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-2xl border-2 border-[#D4AF37]/30 bg-black">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-red-500">
               <Camera className="h-12 w-12 opacity-20 mb-4" />
               <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="h-full w-full object-cover scale-x-[-1]" 
                />
              )}
              <div className="pointer-events-none absolute inset-0 border-[40px] border-black/40 rounded-full" />
            </>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {!capturedImage ? (
            <button
              onClick={capturePhoto}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
            >
              <Camera className="h-8 w-8" />
            </button>
          ) : (
            <>
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 rounded-2xl bg-white/5 px-6 py-3 font-bold hover:bg-white/10 transition-all"
              >
                <RefreshCw className="h-4 w-4" /> إعادة
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-8 py-3 font-bold text-black hover:bg-[#FFD700] transition-all"
              >
                <Check className="h-5 w-5" /> اعتماد الصورة
              </button>
            </>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};
