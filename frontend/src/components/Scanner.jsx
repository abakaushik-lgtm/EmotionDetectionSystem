import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { Camera, UploadCloud, X, Plus, Minus, Scan, Save, CheckCircle2, ShoppingCart, Droplets, Sun, Heart, RefreshCw, Sparkles, Dna, RussianRuble } from 'lucide-react';
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
  const [knownFlowers, setKnownFlowers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [careGuide, setCareGuide] = useState(null);
  const [symbolism, setSymbolism] = useState(null);
  const [isLoadingCare, setIsLoadingCare] = useState(false);
  const [isLoadingSymbolism, setIsLoadingSymbolism] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [optimizationPlan, setOptimizationPlan] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const totalPrice = flowers.reduce((acc, f) => acc + (f.pricePerUnit * f.quantity), 0);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    fetchKnownFlowers();
    return () => stopCamera();
  }, []);

  const fetchKnownFlowers = async () => {
    try {
      const res = await axios.get('/flowers');
      setKnownFlowers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
      const res = await axios.post('/scan-image', formData, {
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

  const fetchCareGuide = async () => {
    if (flowers.length === 0) return;
    setIsLoadingCare(true);
    try {
      const res = await axios.post('/api/care-guide', { flowers });
      setCareGuide(res.data.guide);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCare(false);
    }
  };
  
  const fetchSymbolism = async () => {
    if (flowers.length === 0) return;
    setIsLoadingSymbolism(true);
    try {
      const res = await axios.post('/api/flower-language', { flowers, occasion });
      setSymbolism(res.data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSymbolism(false);
    }
  };

  const optimizeBudget = async () => {
    if (!targetBudget || flowers.length === 0) return;
    setIsOptimizing(true);
    try {
      const res = await axios.post('/api/budget-optimize', { flowers, targetBudget: Number(targetBudget) });
      setOptimizationPlan(res.data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
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

  const updateFlowerName = (index, newName) => {
    const newFlowers = [...flowers];
    newFlowers[index].name = newName;
    
    // Auto-match price if it exists in known flowers
    const match = knownFlowers.find(kf => kf.name.toLowerCase() === newName.toLowerCase());
    if (match) {
      newFlowers[index].pricePerUnit = match.price;
      newFlowers[index].matched = true;
    } else {
      newFlowers[index].matched = false;
    }
    
    setFlowers(newFlowers);
  };

  const updatePrice = (index, val) => {
    const newFlowers = [...flowers];
    newFlowers[index].pricePerUnit = Number(val);
    newFlowers[index].matched = false; // Manually overridden price
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
      await axios.post('/save-bouquet', {
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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/20 pb-8">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Bouquet <span className="text-indigo-600">Scanner</span></h1>
            <p className="text-slate-500 font-medium mt-2">AI-Powered Floral Recognition & Pricing</p>
          </div>
          <div className="flex gap-4 animate-in slide-in-from-right duration-700">
            <div className="glass px-6 py-3 rounded-2xl shadow-xl border border-white/40">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Database</p>
              <p className="font-bold text-slate-700">{knownFlowers.length} Flowers</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Source */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700 delay-100">
            <div className="glass rounded-[3rem] p-4 shadow-2xl shadow-indigo-100/50 relative overflow-hidden group">
              {!isScanning && !scanComplete ? (
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-3 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center transition-all duration-300 relative z-10 ${
                    isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]' : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-2 font-bold text-lg">Drop your bouquet here</p>
                  <p className="text-slate-400 text-sm mb-8">High resolution images work best</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl cursor-pointer transition-all hover:scale-105 shadow-xl font-bold flex items-center gap-2">
                      <UploadCloud size={20} /> Browse
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <button
                      onClick={startCamera}
                      className="bg-white border border-slate-200 text-slate-800 px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg font-bold flex items-center gap-2 hover:bg-slate-50"
                    >
                      <Camera size={20} /> Camera
                    </button>
                  </div>
                </div>
              ) : isScanning ? (
                <div className="aspect-square rounded-[2.5rem] bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden z-10">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-[scan_2s_infinite]"></div>
                  </div>
                  <div className="relative z-10 text-center px-8">
                    <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-white text-xl font-black tracking-widest uppercase">Analyzing</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10">
                  <img src={image} alt="Scan Result" className="w-full aspect-square object-cover rounded-[2.5rem] shadow-inner" />
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button 
                      onClick={() => { setImage(null); setScanComplete(false); }} 
                      className="bg-white/90 backdrop-blur-md text-slate-800 p-4 rounded-2xl hover:bg-white transition-all shadow-2xl hover:rotate-90"
                    >
                      <RefreshCw size={24} />
                    </button>
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />

              {image && !isScanning && !scanComplete && (
                <button
                  onClick={scanImage}
                  className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Scan /> Start AI Analysis
                </button>
              )}
            </div>

            {isCameraActive && (
              <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-2xl aspect-video bg-black rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none"></div>
                </div>
                <div className="flex gap-6 mt-10">
                  <button onClick={capturePhoto} className="bg-white text-slate-900 p-6 rounded-full hover:scale-110 transition-transform shadow-2xl">
                    <Camera size={32} />
                  </button>
                  <button onClick={stopCamera} className="bg-red-500 text-white p-6 rounded-full hover:scale-110 transition-transform shadow-2xl">
                    <X size={32} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Results */}
          <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
            {scanComplete ? (
              <div className="space-y-8">
                <div className="glass rounded-[3rem] p-10 shadow-2xl border border-white">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Detected Stems</h2>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Real-time Valuation</p>
                    </div>
                    <button onClick={addCustomFlower} className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </button>
                  </div>

                  <div className="space-y-4 mb-12">
                    {flowers.map((f, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-white/40 border border-white/60 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={f.name} 
                              onChange={(e) => updateFlowerName(i, e.target.value)}
                              className="font-black text-xl text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full"
                            />
                            {f.matched && <Sparkles size={16} className="text-amber-500" />}
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 font-bold text-sm">
                            <RussianRuble size={14} />
                            <input 
                              type="number" 
                              value={f.pricePerUnit} 
                              onChange={(e) => updatePrice(i, e.target.value)}
                              className="bg-transparent border-none p-0 focus:ring-0 w-16"
                            />
                            <span>each</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-slate-900/5 rounded-2xl p-2">
                            <button onClick={() => updateQuantity(i, -1)} className="p-2 hover:bg-white rounded-xl transition-colors"><Minus size={16} /></button>
                            <span className="w-10 text-center font-black text-lg">{f.quantity}</span>
                            <button onClick={() => updateQuantity(i, 1)} className="p-2 hover:bg-white rounded-xl transition-colors"><Plus size={16} /></button>
                          </div>
                          <div className="text-2xl font-black text-indigo-600 w-24 flex items-center justify-end gap-1">
                            <RussianRuble size={20} />
                            {(f.pricePerUnit * f.quantity).toFixed(0)}
                          </div>
                          <button onClick={() => removeFlower(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-10">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-slate-400 font-black uppercase tracking-widest text-sm">Total Valuation</span>
                      <div className="flex items-center gap-2 text-5xl font-black text-slate-800">
                        <RussianRuble size={40} />
                        <span>{totalPrice.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={saveBouquet} className="flex-1 bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Save size={20} /> Save Profile
                      </button>
                      <button onClick={() => setIsCheckoutOpen(true)} className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                        <ShoppingCart size={20} /> Checkout
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Features Cards */}
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                      <Droplets size={100} />
                    </div>
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <Droplets className="text-cyan-400" /> AI Care Guide
                    </h3>
                    {!careGuide && !isLoadingCare ? (
                      <button onClick={fetchCareGuide} className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-2xl font-bold transition-all">Generate Guide</button>
                    ) : isLoadingCare ? (
                      <p className="animate-pulse text-indigo-300 font-bold uppercase tracking-widest text-sm">Stylist is thinking...</p>
                    ) : (
                      <p className="text-indigo-100 leading-relaxed text-sm whitespace-pre-wrap">{careGuide}</p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                      <Heart size={100} />
                    </div>
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <Heart className="text-rose-200" /> Floriography
                    </h3>
                    <select 
                      value={occasion} 
                      onChange={e => setOccasion(e.target.value)}
                      className="w-full bg-white/20 border border-white/40 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white/30 transition-all mb-4"
                    >
                      <option value="" className="text-slate-800">Select Occasion</option>
                      <option value="Birthday" className="text-slate-800">Birthday</option>
                      <option value="Wedding" className="text-slate-800">Wedding</option>
                      <option value="Apology" className="text-slate-800">Apology</option>
                    </select>
                    {!symbolism && !isLoadingSymbolism ? (
                      <button onClick={fetchSymbolism} className="bg-white text-rose-600 px-6 py-3 rounded-2xl font-black shadow-lg">Decode Meaning</button>
                    ) : isLoadingSymbolism ? (
                      <p className="animate-pulse text-rose-100 font-bold uppercase tracking-widest text-sm">Reading the language of flowers...</p>
                    ) : (
                      <p className="text-rose-50 leading-relaxed text-sm whitespace-pre-wrap">{symbolism}</p>
                    )}
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
                    <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                      <Plus className="text-indigo-600" /> AI Budget Optimizer
                    </h3>
                    <div className="flex gap-3 mb-6">
                      <div className="relative flex-1">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold flex items-center">
                          <RussianRuble size={18} />
                        </span>
                        <input 
                          type="number" 
                          placeholder="Target Budget" 
                          value={targetBudget}
                          onChange={e => setTargetBudget(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                      <button onClick={optimizeBudget} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">Optimize</button>
                    </div>
                    {optimizationPlan && <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap italic">{optimizationPlan}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="glass rounded-[3rem] p-12 shadow-2xl border border-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl"></div>
                  <h3 className="text-3xl font-black text-slate-800 mb-10">Advanced AI Suite</h3>
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className="bg-indigo-600 p-5 rounded-[1.5rem] text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                        <Scan size={32} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-800">Neural Valuation</h4>
                        <p className="text-slate-400 mt-1 leading-relaxed">Real-time market pricing extracted from thousands of floral data points.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="bg-rose-500 p-5 rounded-[1.5rem] text-white shadow-xl shadow-rose-100 group-hover:scale-110 transition-transform">
                        <Heart size={32} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-800">Symbolic Decoding</h4>
                        <p className="text-slate-400 mt-1 leading-relaxed">Understand the deep emotional history and meaning behind every stem.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="bg-slate-900 p-5 rounded-[1.5rem] text-white shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                        <Dna size={32} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-800">Floral DNA Profiling</h4>
                        <p className="text-slate-400 mt-1 leading-relaxed">Sequence your unique style into a personalized subscription model.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                    <p className="text-2xl font-black mb-2">Ready for analysis?</p>
                    <p className="text-slate-400 font-medium">Upload your bouquet to the left to unlock these features.</p>
                  </div>
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
