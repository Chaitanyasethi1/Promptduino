const ComponentIcon = ({ type, name, id, pins = [] }) => {
  const t = type?.toLowerCase() || '';
  const safePins = Array.isArray(pins) ? pins : [];
  
  // 1. Realistic LED
  if (t.includes('led')) {
    const color = t.includes('red') ? '#ef4444' : (t.includes('green') ? '#22c55e' : (t.includes('yellow') ? '#eab308' : '#3b82f6'));
    return (
      <g>
        <defs>
          <radialGradient id={`grad-led-${id}-${color}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        <rect x="14" y="30" width="2" height="30" fill="#a1a1aa" />
        <rect x="24" y="30" width="2" height="40" fill="#a1a1aa" />
        <path d="M 10 30 L 30 30 L 30 15 A 10 10 0 0 0 10 15 Z" fill={`url(#grad-led-${id}-${color})`} />
      </g>
    );
  }

  // 2. Realistic Button
  if (t.includes('button') || t.includes('switch')) {
    const color = t.includes('red') ? '#ef4444' : (t.includes('blue') ? '#3b82f6' : '#22c55e');
    return (
      <g>
        <rect width="50" height="50" rx="4" fill="#3f3f46" stroke="#18181b" strokeWidth="2" />
        <circle cx="25" cy="25" r="18" fill="#18181b" />
        <circle cx="25" cy="25" r="15" fill={color} stroke="#000" strokeWidth="1" />
        <rect x="-4" y="10" width="8" height="4" fill="#a1a1aa" />
        <rect x="-4" y="36" width="8" height="4" fill="#a1a1aa" />
        <rect x="46" y="10" width="8" height="4" fill="#a1a1aa" />
        <rect x="46" y="36" width="8" height="4" fill="#a1a1aa" />
      </g>
    );
  }

  // 3. Realistic Resistor
  if (t.includes('resistor')) {
    return (
      <g>
        <rect x="0" y="8" width="80" height="4" fill="#a1a1aa" />
        <rect x="20" y="0" width="40" height="20" rx="10" fill="#d4d4d8" />
        <rect x="28" y="0" width="4" height="20" fill="#92400e" />
        <rect x="36" y="0" width="4" height="20" fill="#000" />
        <rect x="44" y="0" width="4" height="20" fill="#ef4444" />
        <rect x="52" y="0" width="2" height="20" fill="#fbbf24" />
      </g>
    );
  }

  // 4. Realistic Arduino Uno
  if (t.includes('uno') || t.includes('arduino')) {
    return (
      <g>
        <rect width="200" height="150" rx="8" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
        <rect x="10" y="20" width="40" height="30" rx="2" fill="#cbd5e1" /> {/* USB */}
        <rect x="10" y="80" width="40" height="50" rx="2" fill="#18181b" /> {/* Jack */}
        <rect x="70" y="5" width="120" height="12" rx="1" fill="#18181b" /> {/* Top Pin Header */}
        <rect x="70" y="133" width="120" height="12" rx="1" fill="#18181b" /> {/* Bottom Pin Header */}
        <text x="130" y="75" textAnchor="middle" fill="#fff" fontSize="10px" fontWeight="black" opacity="0.4">ARDUINO UNO</text>
        {safePins.slice(0, 10).map((p, i) => <circle key={p} cx={75 + i * 11} cy="11" r="2" fill="#fbbf24" />)}
        {safePins.slice(10, 20).map((p, i) => <circle key={p} cx={75 + i * 11} cy="139" r="2" fill="#fbbf24" />)}
      </g>
    );
  }

  // 5. Realistic LCD 16x2
  if (t.includes('lcd') || t.includes('display')) {
    return (
      <g>
        <rect width="220" height="100" rx="4" fill="#166534" stroke="#14532d" strokeWidth="2" />
        <rect x="10" y="10" width="200" height="80" rx="2" fill="#3f6212" /> {/* Screen edge */}
        <rect x="15" y="15" width="190" height="70" rx="1" fill="#365314" /> {/* Screen center */}
        {/* Header pins on top edge */}
        <rect x="25" y="-5" width="160" height="10" fill="#18181b" />
        {safePins.slice(0, 16).map((p, i) => <circle key={p} cx={30 + i * 10} cy="0" r="2" fill="#fbbf24" />)}
      </g>
    );
  }

  // 6. Realistic ESP32-C3
  if (t.includes('esp32') || t.includes('c3')) {
    return (
      <g>
        <rect width="180" height="150" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        <rect x="60" y="20" width="60" height="50" rx="4" fill="#a1a1aa" />
        <text x="90" y="55" textAnchor="middle" fill="#18181b" fontSize="6px" fontWeight="bold">ESP32-C3</text>
        <rect x="20" y="110" width="20" height="20" fill="#3f3f46" />
        <rect x="140" y="110" width="20" height="20" fill="#3f3f46" />
        {safePins.slice(0, Math.max(1, Math.ceil(safePins.length/2))).map((p, i) => (
          <circle key={p} cx={25 + (i * 15)} cy="5" r="3" fill="#fbbf24" />
        ))}
         {safePins.slice(Math.max(1, Math.ceil(safePins.length/2))).map((p, i) => (
          <circle key={p} cx={25 + (i * 15)} cy="145" r="3" fill="#fbbf24" />
        ))}
      </g>
    );
  }

  return (
    <g>
      <rect width="100" height="80" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
      <text x="50" y="20" textAnchor="middle" fill="#71717a" fontSize="8px" fontWeight="bold">{(name || type || '').toUpperCase()}</text>
      {safePins.map((p, i) => {
        const half = Math.max(1, Math.ceil(safePins.length / 2));
        const x = i < half ? 0 : 100;
        const y = 30 + (i % half) * 15;
        return <rect key={p} x={x-2} y={y} width="4" height="2" fill="#a1a1aa" />;
      })}
    </g>
  );
};

export default function CircuitDiagram({ diagram }) {
  try {
    if (!diagram || !diagram.parts || !Array.isArray(diagram.parts)) return null;

    const partPins = {};
    if (Array.isArray(diagram.connections)) {
      diagram.connections.forEach(conn => {
        if (!conn?.from || !conn?.to || !conn.from.includes(':') || !conn.to.includes(':')) return;
        const [fP, fPin] = conn.from.split(':');
        const [tP, tPin] = conn.to.split(':');
        if (!fP || !fPin || !tP || !tPin) return;
        if (!partPins[fP]) partPins[fP] = new Set();
        if (!partPins[tP]) partPins[tP] = new Set();
        partPins[fP].add(fPin); partPins[tP].add(tPin);
      });
    }

    const completeParts = [...(diagram.parts || [])];
    Object.keys(partPins).forEach(id => {
      if (!completeParts.find(p => p.id === id)) completeParts.push({ id, type: id, name: id.toUpperCase() });
    });

    let counts = { mcu: 0, out: 0, mid: 0 };
    const partsWithPos = completeParts.map((p) => {
      const t = p.type?.toLowerCase() || '';
      const isMcu = t.includes('esp') || t.includes('uno') || t.includes('arduino');
      const isLcd = t.includes('lcd') || t.includes('display');
      
      let x = 350, y = 60;
      if (isMcu) { x = 300; y = 380; counts.mcu++; }
      else if (isLcd) { x = 320; y = 100; counts.out++; }
      else if (t.includes('button')) { 
        x = 60 + (counts.out % 2) * 600; 
        y = 60 + Math.floor(counts.out / 2) * 110;
        counts.out++; 
      }
      else { x = 60 + (counts.mid * 180); y = 240; counts.mid++; }

      return { ...p, pins: Array.from(partPins[p.id] || []), x, y };
    });

    const getPinPos = (pId, pName) => {
      const p = partsWithPos.find(part => part.id === pId);
      if (!p) return { x: 0, y: 0 };
      const t = p.type?.toLowerCase() || '';
      const safePins = Array.isArray(p.pins) ? p.pins : [];
      const idx = Math.max(0, safePins.indexOf(pName));

      if (t.includes('led')) return { x: (p.x || 0) + (idx === 0 ? 15 : 25), y: (p.y || 0) + 30 };
      if (t.includes('button')) {
        const coords = [{x:0, y:12}, {x:0, y:38}, {x:50, y:12}, {x:50, y:38}];
        const c = coords[idx % 4] || coords[0];
        return { x: (p.x || 0) + c.x, y: (p.y || 0) + c.y };
      }
      if (t.includes('resistor')) return { x: (p.x || 0) + (idx === 0 ? 0 : 80), y: (p.y || 0) + 10 };
      if (t.includes('uno') || t.includes('arduino')) {
        const half = Math.max(1, Math.ceil(safePins.length / 2));
        return { x: (p.x || 0) + 75 + (idx % 10) * 11, y: (p.y || 0) + (idx < 10 ? 5 : 145) };
      }
      if (t.includes('lcd') || t.includes('display')) {
        return { x: (p.x || 0) + 30 + (idx % 16) * 10, y: (p.y || 0) };
      }
      if (t.includes('esp32')) {
        const half = Math.max(1, Math.ceil(safePins.length / 2));
        return { x: (p.x || 0) + 25 + (idx % half) * 15, y: (p.y || 0) + (idx < half ? 5 : 145) };
      }
      return { x: (p.x || 0) + 40, y: (p.y || 0) + 60 };
    };

    const renderWire = (start, end) => {
      const sx = start.x || 0; const sy = start.y || 0;
      const ex = end.x || 0; const ey = end.y || 0;
      const midY = Math.max(sy, ey) + 80;
      return `M ${sx} ${sy} C ${sx} ${midY}, ${ex} ${midY}, ${ex} ${ey}`;
    };

    return (
      <div className="w-full h-full bg-[#18181b] overflow-hidden rounded-lg border border-[#27272a] relative">
        <svg className="w-full h-full" viewBox="0 0 850 600">
          <defs>
            <pattern id="dark-grid" width="30" height="30" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="1.2" fill="#3f3f46" opacity="0.4"/>
            </pattern>
            <filter id="shadow">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.4" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#dark-grid)" />

          {Array.isArray(diagram.connections) && diagram.connections.map((conn, i) => {
            if (!conn?.from?.includes(':')) return null;
            const s = getPinPos(conn.from.split(':')[0], conn.from.split(':')[1]);
            const e = getPinPos(conn.to.split(':')[0], conn.to.split(':')[1]);
            const color = conn.color === 'auto' ? '#3b82f6' : (conn.color || '#3b82f6');
            return (
              <motion.path key={`w-${i}`} d={renderWire(s, e)} stroke={color} strokeWidth="2.8" fill="none" strokeLinecap="round"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.05 }}
               style={{ filter: "url(#shadow)" }} />
            );
          })}

          {partsWithPos.map(p => (
            <motion.g key={p.id} transform={`translate(${p.x || 0}, ${p.y || 0})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ComponentIcon type={p.type} name={p.name} id={p.id} pins={p.pins} />
            </motion.g>
          ))}
        </svg>
      </div>
    );
  } catch (err) {
    console.error("Diagram Render Error:", err);
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#18181b] p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-xs">
          <p className="text-red-400 text-sm font-bold mb-2 uppercase tracking-widest font-mono">Sim Error</p>
          <p className="text-zinc-400 text-xs">Waiting for valid circuit data...</p>
        </div>
      </div>
    );
  }
}
