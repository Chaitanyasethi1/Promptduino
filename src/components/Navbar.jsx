import { Save, Check, ArrowRight, Loader2, MonitorSmartphone } from 'lucide-react';
import { useStore } from '../store';

export default function Navbar() {
  const compileCode = useStore(state => state.compileCode);
  const uploadCode = useStore(state => state.uploadCode);
  const isCompiling = useStore(state => state.isCompiling);
  const isSimulating = useStore(state => state.isSimulating);
  const isProcessing = isCompiling || isSimulating;

  return (
    <div className="flex items-center justify-between h-full px-4 text-sm tracking-wide">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 text-[#6392A8] font-bold mr-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain mix-blend-multiply" />
          <span className="text-base font-extrabold tracking-widest text-slate-800 uppercase mt-0.5">PromptDuino</span>
        </div>
        
        {/* Arduino IDE V2 Layout: Toolbar on the left */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={compileCode}
            disabled={isProcessing}
            className="flex items-center justify-center w-8 h-8 text-[#7A7870] hover:text-[#6392A8] hover:bg-[#E0DCD1] rounded-full transition-colors disabled:opacity-50"
            title="Verify"
          >
            {isCompiling ? <Loader2 size={16} className="animate-spin text-[#6392A8]" /> : <Check size={18} strokeWidth={2.5} />}
          </button>
          <button 
            onClick={uploadCode}
            disabled={isProcessing}
            className="flex items-center justify-center w-8 h-8 text-[#7A7870] hover:text-[#798866] hover:bg-[#E0DCD1] rounded-full transition-colors disabled:opacity-50"
            title="Upload"
          >
            {isSimulating ? <Loader2 size={16} className="animate-spin text-[#798866]" /> : <ArrowRight size={18} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Board / Port Selector */}
        <div className="flex items-center border border-[#E0DCD1] rounded-md px-3 py-1 bg-[#F5F3EC] shadow-sm ml-2">
          <MonitorSmartphone size={14} className="text-[#6392A8] mr-2" />
          <select className="bg-transparent text-[13px] text-[#3A3A3A] outline-none w-44 cursor-pointer appearance-none font-medium">
            <option>Wokwi Simulator</option>
            <option>Arduino Uno on COM3</option>
            <option>Arduino Nano on COM4</option>
            <option>ESP32 on COM5</option>
          </select>
        </div>

        <div className="w-px h-5 bg-[#E0DCD1] mx-4"></div>

        <div className="flex items-center space-x-5 text-[#7A7870]">
          <button className="hover:text-[#3A3A3A] transition-colors font-medium">File</button>
          <button className="hover:text-[#3A3A3A] transition-colors font-medium">Project</button>
          <button className="hover:text-[#3A3A3A] transition-colors font-medium">Settings</button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-1.5 text-[#7A7870] hover:text-[#3A3A3A] transition-colors font-medium ml-2">
          <Save size={15} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
