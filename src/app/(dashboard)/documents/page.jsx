import { FileText } from 'lucide-react';
export default function DocumentsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#2f2f2f] flex items-center justify-center mb-4">
        <FileText className="text-white" size={32} />
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Document Intelligence</h1>
      <p className="text-gray-400 max-w-md">Upload PDFs and chat with them. This feature is coming soon in the next update!</p>
    </div>
  );
}
