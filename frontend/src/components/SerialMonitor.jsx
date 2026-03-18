import { TerminalSquare, Trash2 } from 'lucide-react';

export default function SerialMonitor() {
  return (
    <div className="h-full flex flex-col font-mono text-sm bg-[#FAFAFA]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#F5F4F0] border-b border-[#E5E5E5]">
        <div className="flex items-center text-[#555555] font-semibold text-xs">
          <TerminalSquare size={14} className="mr-2" />
          SERIAL MONITOR
        </div>
        <button className="text-[#888888] hover:text-[#333333]" title="Clear output">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-[#444444] max-h-full">
        <p className="py-1 text-[#888888]">Connecting to Wokwi virtual serial port...</p>
        <p className="py-1 text-[#2E7D32]">Connected at 115200 baud</p>
        <p className="py-1 text-[#333333] font-medium">Hello, PromptDuino!</p>
        <div className="mt-2 flex items-center">
          <span className="text-[#2E7D32] mr-2">&gt;</span>
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-[#333333] focus:ring-0 placeholder-[#A0A0A0]" 
            placeholder="Type a message to send to the Arduino..."
          />
        </div>
      </div>
    </div>
  );
}
