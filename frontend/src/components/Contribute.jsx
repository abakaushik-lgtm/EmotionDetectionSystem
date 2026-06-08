import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contribute() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert('Please upload an image.');
    
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('name', name);
    formData.append('proposedPrice', price);

    try {
      await axios.post('/api/crowdsource', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Flower submitted! It is now pending Admin approval & AI Training.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit flower.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass rounded-[3rem] shadow-2xl border border-white p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <h1 className="text-4xl font-black text-slate-800 mb-2">Crowdsource Flower DB</h1>
        <p className="text-slate-500 text-lg mb-10 max-w-xl">Help us train our AI! Upload a picture of a new flower to expand our global floral intelligence.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <label className="block text-slate-400 font-bold uppercase text-xs tracking-widest mb-3">Flower Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Bluebell"
                  required 
                  className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium" 
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase text-xs tracking-widest mb-3">Proposed Base Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.00"
                    required 
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-lg" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase text-xs tracking-widest mb-3">Visual Evidence</label>
              <label className="border-3 border-dashed border-slate-200 rounded-[2rem] h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-500 transition-all relative overflow-hidden group shadow-inner bg-slate-50/50">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center group-hover:scale-110 transition-transform">
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-3 text-indigo-500">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-sm">Drop image or click to browse</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFile} required />
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-lg">
            Submit for AI Training
          </button>
        </form>
      </div>
    </div>
  );
}
