import { Monitor, RefreshCcw, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { useEffect } from 'react';

export default function SimulationPanel() {
  const isSimulating = useStore(state => state.isSimulating);
  const uploadCode = useStore(state => state.uploadCode);

  return (
    <div className="h-full flex flex-col bg-[#EFECE1]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#EFECE1]">
        <div className="flex items-center text-xs font-semibold tracking-wide text-[#7A7870] uppercase">
          <Monitor size={14} className="mr-2 text-[#6392A8]" />
          Simulation
        </div>
        <button 
          onClick={uploadCode}
          disabled={isSimulating}
          className="text-[#A3B0A3]/70 hover:text-[#7A7870] transition-colors disabled:opacity-50" 
          title="Restart Simulator"
        >
          <RefreshCcw size={15} className={isSimulating ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="flex-1 px-4 pb-4">
        {/* Placeholder for Iframe */}
        <div className="w-full h-full border border-[#E0DCD1] bg-[#F5F3EC] rounded-lg flex flex-col items-center justify-center text-[#B3B0A3] shadow-sm relative overflow-hidden">
          {isSimulating ? (
            <>
              <Loader2 size={48} className="mb-4 text-[#6392A8] animate-spin" />
              <p className="font-medium text-[#7A7870]">Simulating on Server...</p>
              <p className="text-xs pt-1.5 opacity-80 animate-pulse">Running Wokwi HTTP Build</p>
            </>
          ) : (
            <>
              <Monitor size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-[#7A7870]">Simulation View</p>
              <p className="text-xs pt-1.5 opacity-80">Click Top Right Navbar 'Upload' to compile via HTTP REST Endpoint</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
