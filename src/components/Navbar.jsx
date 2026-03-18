import { Play, Settings, Save, FolderOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="flex items-center justify-between h-full px-4 bg-[#F5F4F0] text-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-[#007acc] font-bold">
          <span className="text-xl">⚡</span>
          <span>PromptDuino</span>
        </div>
        
        <div className="flex items-center space-x-4 text-[#555555]">
          <button className="hover:text-black transition-colors font-medium">File</button>
          <button className="hover:text-black transition-colors font-medium">Project</button>
          <button className="hover:text-black transition-colors font-medium">Settings</button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 text-[#555555] hover:text-black transition-colors font-medium">
          <Save size={16} />
          <span>Save</span>
        </button>
        <button className="flex items-center space-x-1 bg-[#007acc] hover:bg-[#005f9e] text-white px-3 py-1 rounded transition-colors font-medium shadow-sm">
          <Play size={16} />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
}
