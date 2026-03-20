const ComponentIcon = ({ type, name, pins }) => {
  const t = type?.toLowerCase() || '';
  
  // 1. Realistic LED
  if (t.includes('led')) {
    const color = t.includes('red') ? '#ef4444' : (t.includes('green') ? '#22c55e' : (t.includes('yellow') ? '#eab308' : '#3b82f6'));
    return (
      <g>
        <defs>
          <radialGradient id={`grad-led-${color}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        <rect x="14" y="30" width="2" height="30" fill="#a1a1aa" /> {/* Cathode */}
        <rect x="24" y="30" width="2" height="40" fill="#a1a1aa" /> {/* Anode */}
        <path d="M 10 30 L 30 30 L 30 15 A 10 10 0 0 0 10 15 Z" fill={`url(#grad-led-${color})`} />
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
        <rect x="28" y="0" width="4" height="20" fill="#92400e" /> {/* Brown */}
        <rect x="36" y="0" width="4" height="20" fill="#000" />    {/* Black */}
        <rect x="44" y="0" width="4" height="20" fill="#ef4444" /> {/* Red */}
        <rect x="52" y="0" width="2" height="20" fill="#fbbf24" /> {/* Gold */}
      </g>
    );
  }

  // 4. Realistic Buzzer (Piezo)
  if (t.includes('buzzer') || t.includes('piezo')) {
    return (
      <g>
        <circle cx="40" cy="40" r="40" fill="#18181b" stroke="#3f3f46" strokeWidth="3" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#3f3f46" strokeWidth="1" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="#3f3f46" strokeWidth="1" />
        <circle cx="40" cy="40" r="5" fill="#000" />
      </g>
    );
  }

  // 5. Realistic ESP32-C3 Top-Down
  if (t.includes('esp32') || t.includes('c3')) {
    return (
      <g>
        <rect width="180" height="150" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        <rect x="60" y="20" width="60" height="50" rx="4" fill="#a1a1aa" />
        <text x="90" y="55" textAnchor="middle" fill="#18181b" fontSize="6px" fontWeight="bold">ESP32-C3</text>
        <rect x="20" y="110" width="20" height="20" fill="#3f3f46" /> {/* Boot */}
        <rect x="140" y="110" width="20" height="20" fill="#3f3f46" /> {/* Reset */}
        
        {/* Top Pins */}
        {pins.slice(0, Math.ceil(pins.length/2)).map((p, i) => (
          <circle key={p} cx={25 + (i * 15)} cy="5" r="3" fill="#fbbf24" />
        ))}
         {/* Bottom Pins */}
         {pins.slice(Math.ceil(pins.length/2)).map((p, i) => (
          <circle key={p} cx={25 + (i * 15)} cy="145" r="3" fill="#fbbf24" />
        ))}
      </g>
    );
  }

  // Fallback for others (like 7Seg or Chips)
  return (
    <g>
      <rect width="80" height="120" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
      <text x="40" y="20" textAnchor="middle" fill="#71717a" fontSize="8px" fontWeight="bold">{(name || type).toUpperCase()}</text>
      {pins.map((p, i) => {
        const isLeft = i < pins.length / 2;
        const x = isLeft ? 0 : 80;
        const y = 30 + (i % Math.ceil(pins.length/2)) * 15;
        return <rect key={p} x={x-2} y={y} width="4" height="2" fill="#a1a1aa" />;
      })}
    </g>
  );
};

export default function CircuitDiagram({ diagram }) {
  if (!diagram || !diagram.parts) return null;

  const partPins = {};
  if (diagram.connections) {
    diagram.connections.forEach(conn => {
      if (!conn.from || !conn.to) return;
      const [fP, fPin] = conn.from.split(':');
      const [tP, tPin] = conn.to.split(':');
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
    const isMcu = t.includes('esp') || t.includes('uno');
    const isBig = t.includes('buzzer') || t.includes('7seg');
    
    let x = 350, y = 60;
    if (isMcu) { x = 320; y = 350; counts.mcu++; }
    else if (t.includes('button')) { 
      x = 100 + (counts.out % 2) * 450; 
      y = 80 + Math.floor(counts.out / 2) * 120;
      counts.out++; 
    }
    else { x = 120 + (counts.mid * 100); y = 250; counts.mid++; }

    return { ...p, pins: Array.from(partPins[p.id] || []), x, y };
  });

  const getPinPos = (pId, pName) => {
    const p = partsWithPos.find(part => part.id === pId);
    if (!p) return { x: 0, y: 0 };
    const t = p.type?.toLowerCase() || '';
    const idx = p.pins.indexOf(pName);

    if (t.includes('led')) return { x: p.x + (idx === 0 ? 15 : 25), y: p.y + (idx === 0 ? 30 : 30) };
    if (t.includes('button')) {
      const coords = [{x:0, y:12}, {x:0, y:38}, {x:50, y:12}, {x:50, y:38}];
      const c = coords[idx % 4];
      return { x: p.x + c.x, y: p.y + c.y };
    }
    if (t.includes('resistor')) return { x: p.x + (idx === 0 ? 0 : 80), y: p.y + 10 };
    if (t.includes('esp32')) {
      const half = Math.ceil(p.pins.length / 2);
      return { x: p.x + 25 + (idx % half) * 15, y: p.y + (idx < half ? 5 : 145) };
    }
    return { x: p.x + 40, y: p.y + 60 };
  };

  const renderWire = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.max(start.y, end.y) + 80;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full h-full bg-[#18181b] overflow-hidden rounded-lg border border-[#27272a]">
      <svg className="w-full h-full" viewBox="0 0 850 600">
        <defs>
          <pattern id="dark-grid" width="30" height="30" patternUnits="userSpaceOnUse">
             <circle cx="2" cy="2" r="1.2" fill="#3f3f46" opacity="0.3"/>
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.5" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#dark-grid)" />

        {diagram.connections?.map((conn, i) => {
          const s = getPinPos(conn.from.split(':')[0], conn.from.split(':')[1]);
          const e = getPinPos(conn.to.split(':')[0], conn.to.split(':')[1]);
          const color = conn.color === 'auto' ? '#3b82f6' : (conn.color || '#3b82f6');
          return (
            <motion.path key={i} d={renderWire(s, e)} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
             style={{ filter: "url(#shadow)" }} />
          );
        })}

        {partsWithPos.map(p => (
          <motion.g key={p.id} transform={`translate(${p.x}, ${p.y})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ComponentIcon type={p.type} name={p.name} pins={p.pins} />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
