import { Image as ImageIcon } from 'lucide-react';
export default function ImagesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#2f2f2f] flex items-center justify-center mb-4">
        <ImageIcon className="text-white" size={32} />
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Image Studio</h1>
      <p className="text-gray-400 max-w-md">Generate stunning images with AI. This feature is coming soon in the next update!</p>
    </div>
  );
}
