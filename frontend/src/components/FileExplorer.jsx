import { ChevronDown, FileCode2, FolderTree } from 'lucide-react';

export default function FileExplorer() {
  return (
    <div className="flex flex-col h-full text-sm">
      <div className="flex items-center px-4 py-2 uppercase text-xs font-semibold tracking-wider text-[#555555] bg-[#EAE9E4]">
        <FolderTree size={14} className="mr-2" />
        Explorer
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {/* Project Folder */}
        <div className="mb-2">
          <div className="flex items-center px-2 py-1 hover:bg-[#EAE9E4] cursor-pointer text-[#444444] rounded">
            <ChevronDown size={14} className="mr-1" />
            <span className="font-medium">MyProject</span>
          </div>
          
          {/* Files */}
          <div className="ml-4 border-l border-[#D1D1D1] pl-2 mt-1 space-y-1">
            <div className="flex items-center px-2 py-1 bg-[#E0DFDA] text-[#333333] cursor-pointer rounded font-medium">
              <FileCode2 size={14} className="mr-2 text-[#4A90E2]" />
              main.ino
            </div>
            <div className="flex items-center px-2 py-1 hover:bg-[#EAE9E4] cursor-pointer text-[#666666] rounded">
              <FileCode2 size={14} className="mr-2 text-[#E25A4A]" />
              diagram.json
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
