import { TerminalSquare, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { socket } from '../socket';
import { useEffect, useRef, useState } from 'react';

export default function SerialMonitor() {
  const serialLogs = useStore(state => state.serialLogs);
  const addSerialLog = useStore(state => state.addSerialLog);
  const clearSerialLogs = useStore(state => state.clearSerialLogs);
  const autoScrollRef = useRef(null);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const handleSerial = (data) => addSerialLog({ type: 'received', text: data.text });
    socket.on('serial_output', handleSerial);
    return () => socket.off('serial_output', handleSerial);
  }, [addSerialLog]);

  useEffect(() => {
    autoScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    socket.emit('serial_input', { text: inputVal });
    addSerialLog({ type: 'sent', text: inputVal });
    setInputVal("");
  };
  return (
    <div className="h-full flex flex-col font-mono text-[13px] bg-[#F5F3EC]">
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#EFECE1] border-b border-[#E0DCD1]">
        <div className="flex items-center text-[#7A7870] font-semibold text-xs tracking-wider">
          <TerminalSquare size={14} className="mr-2.5" />
          SERIAL MONITOR
        </div>
        <button 
          onClick={clearSerialLogs}
          className="text-[#A3B0A3]/70 hover:text-[#7A7870] transition-colors" 
          title="Clear output"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 text-[#7A7870] max-h-full leading-relaxed">
        {serialLogs.map((log, i) => (
          <p key={i} className={`py-0.5 ${log.type === 'sent' ? 'text-[#6392A8]' : 'text-[#3A3A3A]'}`}>
            {log.text}
          </p>
        ))}
        <div ref={autoScrollRef} />
        
        <div className="mt-3 flex items-center group">
          <span className="text-[#6392A8] mr-3 font-bold">&gt;</span>
          <input 
            type="text" 
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none outline-none text-[#3A3A3A] focus:ring-0 placeholder-[#B3B0A3]" 
            placeholder="Type a message to send to the Arduino..."
          />
        </div>
      </div>
    </div>
  );
}
