import { Play, Save } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="flex items-center justify-between h-full px-4 text-sm tracking-wide">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 text-[#6392A8] font-bold">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain mix-blend-multiply" />
          <span className="text-base tracking-widest text-[#3A3A3A] uppercase mt-0.5">PromptDuino</span>
        </div>
        
        <div className="flex items-center space-x-5 text-[#7A7870]">
          <button className="hover:text-[#3A3A3A] transition-colors font-medium">File</button>
          <button className="hover:text-[#3A3A3A] transition-colors font-medium">Project</button>
          <button className="hover:text-[#3A3A3A] transition-colors font-medium">Settings</button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1.5 text-[#7A7870] hover:text-[#3A3A3A] transition-colors font-medium">
          <Save size={15} />
          <span>Save</span>
        </button>
        <button className="flex items-center space-x-1.5 bg-[#6392A8] hover:bg-[#527D91] text-white px-4 py-1.5 rounded-md transition-colors font-medium shadow-sm">
          <Play size={14} className="fill-current" />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
}
