import { TerminalSquare, Trash2 } from 'lucide-react';

export default function SerialMonitor() {
  return (
    <div className="h-full flex flex-col font-mono text-[13px] bg-[#F5F3EC]">
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#EFECE1] border-b border-[#E0DCD1]">
        <div className="flex items-center text-[#7A7870] font-semibold text-xs tracking-wider">
          <TerminalSquare size={14} className="mr-2.5" />
          SERIAL MONITOR
        </div>
        <button className="text-[#A3B0A3]/70 hover:text-[#7A7870] transition-colors" title="Clear output">
          <Trash2 size={15} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 text-[#7A7870] max-h-full leading-relaxed">
        <p className="py-0.5 opacity-80">Connecting to Wokwi virtual serial port...</p>
        <p className="py-0.5 text-[#798866]">Connected at 115200 baud</p>
        <p className="py-1 text-[#3A3A3A]">Hello, PromptDuino!</p>
        
        <div className="mt-3 flex items-center group">
          <span className="text-[#6392A8] mr-3 font-bold">&gt;</span>
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-[#3A3A3A] focus:ring-0 placeholder-[#B3B0A3]" 
            placeholder="Type a message to send to the Arduino..."
          />
        </div>
      </div>
    </div>
  );
}
