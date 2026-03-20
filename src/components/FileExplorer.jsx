import { ChevronDown, FileCode2, FolderTree } from 'lucide-react';
import { useStore } from '../store';

export default function FileExplorer() {
  const activeFile = useStore(state => state.activeFile);
  const setActiveFile = useStore(state => state.setActiveFile);

  return (
    <div className="flex flex-col h-full text-[13px] bg-[#EFECE1]">
      <div className="flex items-center px-5 py-3 text-xs font-semibold tracking-[0.05em] text-[#7A7870] uppercase">
        <FolderTree size={14} className="mr-2" />
        Explorer
      </div>
      
      <div className="flex-1 overflow-y-auto px-2">
        {/* Project Folder */}
        <div className="mb-2">
          <div className="flex items-center px-3 py-1.5 hover:bg-[#E0DCD1] cursor-pointer text-[#3A3A3A] rounded-md transition-colors font-medium">
            <ChevronDown size={14} className="mr-1.5 text-[#7A7870]" />
            <span>MyProject</span>
          </div>
          
          {/* Files */}
          <div className="ml-5 border-l border-[#E0DCD1] pl-2 mt-1 space-y-0.5">
            <div 
              onClick={() => setActiveFile('main.ino')}
              className={`flex items-center px-3 py-1.5 cursor-pointer rounded-md font-medium transition-colors ${activeFile === 'main.ino' ? 'bg-[#E0DCD1] text-[#3A3A3A]' : 'text-[#7A7870] hover:bg-[#E0DCD1]/50'}`}
            >
              <FileCode2 size={15} className={`mr-2.5 ${activeFile === 'main.ino' ? 'text-[#6392A8]' : 'text-[#A3B0A3]'}`} />
              main.ino
            </div>
            <div 
              onClick={() => setActiveFile('diagram.json')}
              className={`flex items-center px-3 py-1.5 cursor-pointer rounded-md font-medium transition-colors ${activeFile === 'diagram.json' ? 'bg-[#E0DCD1] text-[#3A3A3A]' : 'text-[#7A7870] hover:bg-[#E0DCD1]/50'}`}
            >
              <FileCode2 size={15} className={`mr-2.5 ${activeFile === 'diagram.json' ? 'text-[#D18F52]' : 'text-[#A3B0A3]'}`} />
              diagram.json
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
