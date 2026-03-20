import { Monitor, RefreshCcw, Loader2, Cpu } from 'lucide-react';
import { useStore } from '../store';
import { useEffect } from 'react';
import CircuitDiagram from './CircuitDiagram';

export default function SimulationPanel() {
  const isSimulating = useStore(state => state.isSimulating);
  const hasSimulated = useStore(state => state.hasSimulated);
  const uploadCode = useStore(state => state.uploadCode);
  const diagram = useStore(state => state.diagram);

  return (
    <div className="h-full flex flex-col bg-[#EFECE1]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#EFECE1]">
        <div className="flex items-center text-xs font-semibold tracking-wide text-[#7A7870] uppercase">
          <Monitor size={14} className="mr-2 text-[#6392A8]" />
          Simulation
        </div>
        <div className="flex items-center space-x-3">
          {diagram && (
            <div className="flex items-center text-[10px] bg-[#D1E1BB]/50 text-[#5C6D44] px-2 py-0.5 rounded-full border border-[#B8CC99]/60 font-medium">
              <Cpu size={10} className="mr-1" />
              Connection Logic Ready
            </div>
          )}
          <button
            onClick={uploadCode}
            disabled={isSimulating}
            className="text-[#A3B0A3]/70 hover:text-[#7A7870] transition-colors disabled:opacity-50"
            title="Restart Simulator"
          >
            <RefreshCcw size={15} className={isSimulating ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4">
        <div className="w-full h-full border border-[#E0DCD1] bg-[#F5F3EC] rounded-lg flex flex-col items-center justify-center text-[#B3B0A3] shadow-sm relative overflow-hidden">
          {isSimulating ? (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="relative mb-6">
                <Loader2 size={56} className="text-[#6392A8] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu size={24} className="text-[#6392A8]/40" />
                </div>
              </div>
              <p className="font-semibold text-lg text-[#5A5850] mb-1">Simulating...</p>
              <p className="text-sm text-[#7A7870] max-w-[200px] leading-relaxed">Preparing virtual environment and uploading firmwares...</p>
              <div className="mt-6 flex space-x-1.5 justify-center">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-[#6392A8]/30 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
            </div>
          ) : diagram ? (
            <div className="w-full h-full relative group p-1">
              <CircuitDiagram diagram={diagram} />
              
              {/* Tooltip or status when viewing diagram */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                <div className="bg-[#EFECE1]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#E0DCD1] shadow-sm">
                  <p className="text-[10px] text-[#7A7870] font-medium leading-none mb-1 uppercase tracking-tight">Circuit Map</p>
                  <p className="text-[11px] text-[#5A5850] font-bold">Auto-generated connections</p>
                </div>
                
                {hasSimulated && (
                  <div className="bg-[#798866] text-[#F5F3EC] px-3 py-1.5 rounded-lg shadow-md flex items-center space-x-2 animate-bounce-slow">
                    <div className="w-2 h-2 bg-[#A3BC8C] rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-bold">LIVE SIGNAL</span>
                  </div>
                )}
              </div>
            </div>
          ) : hasSimulated ? (
            <div className="flex flex-col items-center justify-center p-8 glass-effect">
              <div className="relative mb-6">
                 <div className="w-20 h-20 bg-[#6392A8]/10 rounded-full flex items-center justify-center">
                   <Monitor size={48} className="text-[#6392A8]" />
                 </div>
                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#F5F3EC] animate-pulse"></div>
              </div>
              <p className="font-bold text-lg text-[#5A5850] mb-1">Simulation Active</p>
              <p className="text-sm text-[#7A7870] text-center max-w-[220px]">Program is running on the mock server. Check the Serial Monitor below for output.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 group opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-24 h-24 bg-[#E0DCD1]/30 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Monitor size={56} className="text-[#A3B0A3] group-hover:text-[#7A7870] transition-colors" />
              </div>
              <p className="font-bold text-lg text-[#7A7870] mb-2 uppercase tracking-wide">Simulation Ready</p>
              <p className="text-xs text-[#A3B0A3] max-w-[240px] text-center leading-relaxed">Construct your circuit via Chat to see visual connections here, or upload code directly.</p>
              <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
                 <div className="border border-dashed border-[#E0DCD1] rounded-lg p-2 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#6392A8]"></div>
                    <span className="text-[9px] text-[#7A7870] font-bold uppercase">Dynamic Wires</span>
                 </div>
                 <div className="border border-dashed border-[#E0DCD1] rounded-lg p-2 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#798866]"></div>
                    <span className="text-[9px] text-[#7A7870] font-bold uppercase">Auto Layout</span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
