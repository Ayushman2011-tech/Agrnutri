import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  QrCode,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import jsQR from 'jsqr';
import { useApp } from '../context/AppContext';

export const QRScannerModal: React.FC = () => {
  const {
    isQrScannerOpen,
    setIsQrScannerOpen,
    inspectBatch,
    showNotification,
    batchesRegistry,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('Align QR code within the view frame');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Stop camera stream safely
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setScanStatus('Requesting camera access...');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsScanning(true);
        setScanStatus('Scanning actively... Align QR code inside square');
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can still upload a QR image or select sample batches below!'
          : 'Unable to access camera directly in this view. Use Image Upload or Sample Batches below.'
      );
      setIsScanning(false);
    }
  };

  const tickScan = () => {
    if (
      videoRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
      canvasRef.current
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          handleFoundCode(code.data);
          return;
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(tickScan);
  };

  const handleFoundCode = (codeText: string) => {
    stopCamera();
    // Parse code (could be full URL e.g. https://agrinutrifarm.org/trace/AGRI-OD-2026-TOM or just batchId)
    let extracted = codeText.trim();
    if (extracted.includes('/trace/')) {
      extracted = extracted.split('/trace/')[1];
    }
    const found = inspectBatch(extracted);
    if (found) {
      showNotification(`Batch #${found.batchId} found! Opening passport.`);
      setIsQrScannerOpen(false);
    } else {
      setScanStatus(`Code recognized: "${extracted}" - Unregistered in current ledger.`);
      showNotification(`Code recognized: "${extracted}". No active batch record matched.`);
    }
  };

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleFoundCode(code.data);
          } else {
            showNotification('No QR code detected in this image. Try another image or sample badge.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const found = inspectBatch(manualCode);
    if (found) {
      setIsQrScannerOpen(false);
    } else {
      showNotification(`Batch "${manualCode}" not found in current ledger.`);
    }
  };

  useEffect(() => {
    if (isQrScannerOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isQrScannerOpen, activeTab]);

  if (!isQrScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Scan Batch QR Code
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verify farm origin, harvest date, and lab purity tests
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setIsQrScannerOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'samples'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Batches</span>
          </button>
        </div>

        {/* Tab 1: Live Camera Feed */}
        {activeTab === 'camera' && (
          <div className="mt-4 space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border-2 border-emerald-500/40">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Target Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-2xl relative">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400"></div>
                  <div className="w-full h-0.5 bg-emerald-400/80 absolute top-0 animate-[bounce_2.5s_infinite]"></div>
                </div>
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center text-white space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs">{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('samples')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
                  >
                    Select Demo Batch Instead →
                  </button>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              {scanStatus}
            </p>
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === 'upload' && (
          <div className="mt-4 space-y-4">
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40">
              <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Upload QR Code Photo or Screenshot
              </span>
              <span className="text-[11px] text-slate-500 mt-1">PNG, JPG or WEBP accepted</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Tab 3: Preset Demo Batches */}
        {activeTab === 'samples' && (
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Click any verified batch below to immediately test the traceability passport:
            </p>
            {Object.values(batchesRegistry).map((b) => (
              <button
                key={b.batchId}
                onClick={() => {
                  inspectBatch(b.batchId);
                  setIsQrScannerOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      #{b.batchId}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                      {b.qualityGrade}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                    {b.productName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {b.farmLocation.split(',')[0]} · {b.farmerName.split('&')[0]}
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Manual Code Input Bar */}
        <form onSubmit={handleManualLookup} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Or Enter Batch ID Manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. AGRI-OD-2026-TOM"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
