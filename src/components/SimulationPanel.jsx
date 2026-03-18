import { Monitor, RefreshCcw } from 'lucide-react';

export default function SimulationPanel() {
  return (
    <div className="h-full flex flex-col bg-[#EFECE1]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#EFECE1]">
        <div className="flex items-center text-xs font-semibold tracking-wide text-[#7A7870] uppercase">
          <Monitor size={14} className="mr-2 text-[#6392A8]" />
          Simulation
        </div>
        <button className="text-[#A3B0A3]/70 hover:text-[#7A7870] transition-colors" title="Restart Simulator">
          <RefreshCcw size={15} />
        </button>
      </div>
      <div className="flex-1 px-4 pb-4">
        {/* Placeholder for Iframe */}
        <div className="w-full h-full border border-[#E0DCD1] bg-[#F5F3EC] rounded-lg flex flex-col items-center justify-center text-[#B3B0A3] shadow-sm">
          <Monitor size={48} className="mb-4 opacity-50" />
          <p className="font-medium text-[#7A7870]">Simulation View</p>
          <p className="text-xs pt-1.5 opacity-80">Connects to Wokwi via WebSocket</p>
        </div>
      </div>
    </div>
  );
}
