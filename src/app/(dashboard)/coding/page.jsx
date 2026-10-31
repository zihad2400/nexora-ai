import { Code } from 'lucide-react';
export default function CodingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#2f2f2f] flex items-center justify-center mb-4">
        <Code className="text-white" size={32} />
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Coding Assistant</h1>
      <p className="text-gray-400 max-w-md">Get help with your code, debugging, and optimization. Coming soon!</p>
    </div>
  );
}
