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
      await axios.post('http://localhost:5000/api/crowdsource', formData, {
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Crowdsource Flower DB</h1>
        <p className="text-slate-500 mb-8">Help us train our AI! Upload a picture of a new flower, tell us its name, and set a base price.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 font-medium mb-2">Flower Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Bluebell"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">Proposed Base Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 5.50"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">Flower Image</label>
              <label className="border-3 border-dashed border-slate-300 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-colors relative overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-500 flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 mb-2 text-indigo-400" />
                    <span>Upload Image</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFile} required />
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
            Submit for AI Training
          </button>
        </form>
      </div>
    </div>
  );
}
