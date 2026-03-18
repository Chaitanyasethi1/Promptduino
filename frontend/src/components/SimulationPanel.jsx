import { Monitor, RefreshCcw } from 'lucide-react';

export default function SimulationPanel() {
  return (
    <div className="h-full flex flex-col bg-[#FAF9F6]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#F5F4F0] border-b border-[#E5E5E5]">
        <div className="flex items-center text-xs font-semibold text-[#555555]">
          <Monitor size={14} className="mr-2 text-[#007acc]" />
          WOKWI SIMULATOR
        </div>
        <button className="text-[#888888] hover:text-[#333333]" title="Restart Simulator">
          <RefreshCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Placeholder for Iframe */}
        <div className="w-full h-full border-2 border-dashed border-[#D1D1D1] rounded flex flex-col items-center justify-center text-[#999999] bg-white">
          <Monitor size={48} className="mb-4 opacity-30" />
          <p className="font-medium text-[#777777]">Simulation View Area</p>
          <p className="text-xs pt-2">Connects to Wokwi via WebSocket</p>
        </div>
      </div>
    </div>
  );
}
