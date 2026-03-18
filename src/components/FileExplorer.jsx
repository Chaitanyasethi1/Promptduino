import { ChevronDown, FileCode2, FolderTree } from 'lucide-react';

export default function FileExplorer() {
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
            <div className="flex items-center px-3 py-1.5 bg-[#E0DCD1] text-[#3A3A3A] cursor-pointer rounded-md font-medium">
              <FileCode2 size={15} className="mr-2.5 text-[#6392A8]" />
              main.ino
            </div>
            <div className="flex items-center px-3 py-1.5 hover:bg-[#E0DCD1]/50 cursor-pointer text-[#7A7870] rounded-md transition-colors">
              <FileCode2 size={15} className="mr-2.5 text-[#D18F52]" />
              diagram.json
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
