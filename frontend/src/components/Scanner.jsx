import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { Camera, UploadCloud, X, Plus, Minus, Scan, Save, CheckCircle2, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

export default function Scanner() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const totalPrice = flowers.reduce((acc, f) => acc + (f.pricePerUnit * f.quantity), 0);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
      setImage(null);
      setScanComplete(false);
      setFlowers([]);
    } catch (err) {
      console.error('Error accessing camera', err);
      alert('Could not access camera. Please allow permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;
      
      if (width === 0 || height === 0) {
        alert("Camera stream not fully loaded yet. Please try again in a second.");
        return;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to capture image. Please try uploading instead.");
          return;
        }
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        setImage(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg', 0.95);
    } else {
      alert("Camera component not found.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    stopCamera();
    setScanComplete(false);
    setFlowers([]);
  };

  const scanImage = async () => {
    if (!imageFile) return;
    setIsScanning(true);
    setScanComplete(false);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await axios.post('http://localhost:5000/scan-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFlowers(res.data.matchedFlowers || []);
      setSuggestions(res.data.suggestions || []);
      setAnalysis({
        score: res.data.freshnessScore,
        quality: res.data.quality,
        colors: res.data.colorPalette
      });
      setScanComplete(true);
    } catch (err) {
      console.error(err);
      alert('Failed to scan image. Is the backend running?');
    } finally {
      setIsScanning(false);
    }
  };

  const updateQuantity = (index, delta) => {
    const newFlowers = [...flowers];
    const newQty = newFlowers[index].quantity + delta;
    if (newQty > 0) {
      newFlowers[index].quantity = newQty;
      setFlowers(newFlowers);
    }
  };

  const updatePrice = (index, val) => {
    const newFlowers = [...flowers];
    newFlowers[index].pricePerUnit = Number(val);
    setFlowers(newFlowers);
  };

  const removeFlower = (index) => {
    const newFlowers = [...flowers];
    newFlowers.splice(index, 1);
    setFlowers(newFlowers);
  };

  const addCustomFlower = () => {
    setFlowers([...flowers, { name: 'Unknown Flower', pricePerUnit: 0, quantity: 1 }]);
  };

  const saveBouquet = async () => {
    if (!user) {
      alert("Please log in to save a bouquet");
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/save-bouquet', {
        flowers,
        totalPrice
      });
      alert('Bouquet saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save bouquet.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Bouquet Price Scanner
          </h1>
          <p className="text-slate-500 text-lg">AI-powered flower detection & pricing.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 sm:p-8 transition-all hover:shadow-indigo-200/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Camera className="text-indigo-500" /> Image Source
            </h2>

            {!isCameraActive && !image && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-3 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
                  isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'
                }`}
              >
                <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
                <p className="text-slate-600 mb-2 font-medium">Drag & drop an image here</p>
                <p className="text-slate-400 text-sm mb-6">or</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full cursor-pointer transition-transform transform hover:scale-105 shadow-lg shadow-indigo-200 font-semibold flex items-center gap-2">
                    <UploadCloud size={20} /> Browse Files
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <button
                    onClick={startCamera}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-transform transform hover:scale-105 shadow-lg shadow-purple-200 font-semibold flex items-center gap-2"
                  >
                    <Camera size={20} /> Live Camera
                  </button>
                </div>
              </div>
            )}

            {isCameraActive && (
              <div className="relative rounded-2xl overflow-hidden shadow-inner bg-black aspect-[4/3] flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Camera size={20} /> Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {image && !isCameraActive && (
              <div className="relative rounded-2xl overflow-hidden shadow-md group">
                <img src={image} alt="Bouquet" className="w-full h-auto object-cover max-h-[400px]" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <label className="bg-white text-slate-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors font-medium text-sm">
                    Change Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <button
                    onClick={startCamera}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Camera size={16} /> Retake
                  </button>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />

            {image && (
              <button
                onClick={scanImage}
                disabled={isScanning}
                className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isScanning ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Scan className="animate-spin" /> Analyzing Image...
                  </span>
                ) : (
                  <>
                    <Scan /> Scan for Flowers & Prices
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col transition-all hover:shadow-purple-200/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-purple-500" /> Detected Flowers
            </h2>

            {!scanComplete && !isScanning && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Scan size={48} className="opacity-50" />
                <p>Upload and scan an image to see results here.</p>
              </div>
            )}

            {isScanning && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-indigo-600 font-medium animate-pulse">Running Google Cloud Vision AI...</p>
              </div>
            )}

            {scanComplete && (
              <div className="flex-1 flex flex-col">
                {analysis && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border border-indigo-100 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226.2} strokeDashoffset={226.2 - (226.2 * analysis.score) / 100} className="text-indigo-600 transition-all duration-1000" />
                      </svg>
                      <span className="absolute text-xl font-black text-slate-800">{analysis.score}%</span>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">AI Analysis</span>
                        <h3 className="font-bold text-slate-800">Quality: <span className="text-indigo-600">{analysis.quality}</span></h3>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">AI detected optimal petal turgidity and color vibrancy.</p>
                      <div className="flex justify-center sm:justify-start gap-2">
                        {analysis.colors && analysis.colors.map(c => (
                          <div key={c} className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {flowers.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800">
                    <p className="font-semibold">No predefined flowers matched.</p>
                    <p className="text-sm mt-1">We detected: {suggestions.join(', ')}</p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar">
                    {flowers.map((f, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4">
                        
                        <div className="flex-1 w-full">
                          <input 
                            type="text" 
                            value={f.name} 
                            onChange={(e) => {
                              const newF = [...flowers];
                              newF[i].name = e.target.value;
                              setFlowers(newF);
                            }}
                            className="font-bold text-lg text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full"
                          />
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span>$</span>
                            <input 
                              type="number" 
                              value={f.pricePerUnit} 
                              onChange={(e) => updatePrice(i, e.target.value)}
                              className="w-16 border-b border-slate-300 bg-transparent focus:border-indigo-500 outline-none p-0"
                            />
                            <span>each</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-2">
                          <button onClick={() => updateQuantity(i, -1)} className="p-1 hover:bg-white rounded-md text-slate-600 shadow-sm"><Minus size={16} /></button>
                          <span className="font-semibold w-6 text-center">{f.quantity}</span>
                          <button onClick={() => updateQuantity(i, 1)} className="p-1 hover:bg-white rounded-md text-slate-600 shadow-sm"><Plus size={16} /></button>
                        </div>

                        <div className="font-bold text-indigo-600 w-16 text-right">
                          ${(f.pricePerUnit * f.quantity).toFixed(2)}
                        </div>

                        <button onClick={() => removeFlower(i)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  onClick={addCustomFlower}
                  className="flex items-center justify-center gap-2 text-indigo-600 font-medium py-3 border-2 border-dashed border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors mb-6"
                >
                  <Plus size={18} /> Add Missing Flower
                </button>

                <div className="mt-auto border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-slate-500 font-medium">Total Estimated Price</span>
                    <span className="text-4xl font-extrabold text-slate-800">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={saveBouquet}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Save /> Save Bouquet to Profile
                  </button>
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <ShoppingCart /> Order This Bouquet
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} flowers={flowers} />
    </div>
  );
}
