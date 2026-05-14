import { Share2 } from 'lucide-react';

export default function ShareButtons({ title, text, url }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // User cancelled or failed
      }
    } else {
      // Fallback for Desktop (WhatsApp)
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded-xl font-medium transition-colors text-sm">
      <Share2 size={16} /> Share
    </button>
  );
}
