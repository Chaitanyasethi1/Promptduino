import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ComponentIcon = ({ type, name, id, pins = [] }) => {
  const t = type?.toLowerCase() || '';
  const safePins = (Array.isArray(pins) ? pins : []).filter(p => typeof p === 'string' && p.length > 0);
  const safeId = String(id || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
  
  // 1. Realistic LED
  if (t.includes('led')) {
    const rawColor = t.includes('red') ? '#ef4444' : (t.includes('green') ? '#22c55e' : (t.includes('yellow') ? '#eab308' : '#3b82f6'));
    const safeColorId = rawColor.replace('#', 'hex_');
    return (
      <g>
        <defs>
          <radialGradient id={`grad-led-${safeId}-${safeColorId}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="100%" stopColor={rawColor} />
          </radialGradient>
        </defs>
        <rect x="14" y="30" width="2" height="30" fill="#a1a1aa" />
        <rect x="24" y="30" width="2" height="40" fill="#a1a1aa" />
        <path d="M 10 30 L 30 30 L 30 15 A 10 10 0 0 0 10 15 Z" fill={`url(#grad-led-${safeId}-${safeColorId})`} />
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

  // 3. Realistic Arduino Uno
  if (t.includes('uno') || t.includes('arduino')) {
    return (
      <g>
        <rect width="210" height="150" rx="8" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
        <rect x="10" y="20" width="45" height="35" rx="2" fill="#cbd5e1" />
        <rect x="10" y="85" width="40" height="45" rx="2" fill="#18181b" />
        <rect x="70" y="5" width="130" height="15" fill="#18181b" />
        <rect x="70" y="130" width="130" height="15" fill="#18181b" />
        {safePins.slice(0, 10).map((p, i) => (
          <g key={`p1-${i}`}>
            <circle cx={78 + i * 12} cy="12" r="2.5" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
            <text x={78 + i * 12} y={23} textAnchor="middle" fill="#fff" fontSize="6px" fontWeight="bold" opacity="0.9">{p}</text>
          </g>
        ))}
        {safePins.slice(10, 25).map((p, i) => (
          <g key={`p2-${i}`}>
            <circle cx={78 + i * 12} cy="138" r="2.5" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
            <text x={78 + i * 12} y={130} textAnchor="middle" fill="#fff" fontSize="6px" fontWeight="bold" opacity="0.9">{p}</text>
          </g>
        ))}
        <text x="135" y="75" textAnchor="middle" fill="#fff" fontSize="11px" fontWeight="black" opacity="0.2">ARDUINO UNO</text>
      </g>
    );
  }

  // 4. Realistic LCD 16x2
  if (t.includes('lcd') || t.includes('display')) {
    return (
      <g>
        <rect width="230" height="110" rx="4" fill="#166534" stroke="#14532d" strokeWidth="2" />
        <rect x="10" y="10" width="210" height="80" rx="2" fill="#3f6212" />
        <rect x="15" y="15" width="200" height="70" rx="1" fill="#365314" />
        <rect x="25" y="95" width="180" height="12" fill="#18181b" />
        {safePins.map((p, i) => (
          <g key={`lp-${i}`}>
            <circle cx={35 + i * 11} cy="101" r="2.5" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
            <text x={35 + i * 11} y={92} textAnchor="middle" fill="#fff" fontSize="6px" fontWeight="bold">{p}</text>
          </g>
        ))}
      </g>
    );
  }

  // 5. Realistic Servo Motor
  if (t.includes('servo')) {
    return (
      <g>
        <rect width="80" height="40" rx="4" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
        <circle cx="20" cy="20" r="15" fill="#f8fafc" stroke="#94a3b8" />
        <rect x="5" y="17" width="30" height="6" rx="3" fill="#f1f5f9" transform="rotate(25 20 20)" />
        <circle cx="20" cy="20" r="4" fill="#475569" />
        <rect x="75" y="10" width="15" height="20" fill="#334155" />
        {safePins.map((p, i) => <rect key={`s-${i}`} x={85} y={12 + i*6} width="8" height="3" fill="#fbbf24" />)}
      </g>
    );
  }

  // 6. Ultrasonic Sensor (HC-SR04)
  if (t.includes('ultra') || t.includes('hcsr04')) {
    return (
      <g>
        <rect width="100" height="50" rx="4" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2" />
        <circle cx="25" cy="25" r="18" fill="#a1a1aa" stroke="#71717a" strokeWidth="2" />
        <circle cx="25" cy="25" r="14" fill="#18181b" />
        <circle cx="75" cy="25" r="18" fill="#a1a1aa" stroke="#71717a" strokeWidth="2" />
        <circle cx="75" cy="25" r="14" fill="#18181b" />
        {/* Pins at the bottom */}
        {safePins.map((p, i) => <circle key={`u-${i}`} cx={35 + i*10} cy="55" r="2" fill="#fbbf24" />)}
      </g>
    );
  }

  // 7. DHT Sensor
  if (t.includes('dht') || t.includes('temp')) {
    return (
      <g>
        <rect width="60" height="80" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
        <rect x="10" y="10" width="40" height="50" fill="#3b82f6" />
        {[...Array(5)].map((_, i) => <line key={i} x1="10" y1={15 + i*10} x2="50" y2={15 + i*10} stroke="#1e3a8a" strokeWidth="1" />)}
        {[...Array(4)].map((_, i) => <line key={i} x1={20 + i*10} y1="10" x2={20 + i*10} y2="60" stroke="#1e3a8a" strokeWidth="1" />)}
        {safePins.map((p, i) => <rect key={`d-${i}`} x={15 + i*10} y={75} width="3" height="15" fill="#fbbf24" />)}
      </g>
    );
  }

  // 5. Realistic ESP32 DevKit (Left/Right Headers)
  if (t.includes('esp') || t.includes('c3') || t.includes('devkit')) {
    const half = Math.max(1, Math.ceil(safePins.length/2));
    const height = Math.max(200, half * 16 + 40);
    return (
      <g>
        <rect width="110" height={height} rx="8" fill="#18181b" stroke="#374151" strokeWidth="2" />
        <rect x="25" y="25" width="60" height="55" rx="4" fill="#1f2937" stroke="#4b5563" />
        <rect x="30" y="30" width="50" height="40" rx="2" fill="#374151" />
        <text x="55" y="55" textAnchor="middle" fill="#9ca3af" fontSize="8px" fontWeight="bold">ESP32</text>
        <rect x="25" y="10" width="60" height="10" fill="#111827" />
        <rect x="30" y={height-30} width="15" height="15" rx="3" fill="#374151" />
        <rect x="65" y={height-30} width="15" height="15" rx="3" fill="#374151" />
        {safePins.slice(0, half).map((p, i) => {
          const py = 30 + i * 16;
          return (
            <g key={`el-${i}`}>
               <circle cx="6" cy={py} r="3" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
               <text x="14" y={py+2} fill="#9ca3af" fontSize="7px" fontWeight="bold">{p}</text>
            </g>
          );
        })}
        {safePins.slice(half).map((p, i) => {
          const py = 30 + i * 16;
          return (
            <g key={`er-${i}`}>
               <circle cx="104" cy={py} r="3" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
               <text x="96" y={py+2} textAnchor="end" fill="#9ca3af" fontSize="7px" fontWeight="bold">{p}</text>
            </g>
          );
        })}
      </g>
    );
  }

  // Fallback: Professional Dark Module
  const pinCount = Math.max(1, safePins.length);
  const width = Math.max(100, pinCount * 22);
  return (
    <g>
      <rect width={width} height={100} rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
      <rect x="2" y="2" width={width-4} height={20} rx="2" fill="#18181b" />
      <text x={width/2} y={15} textAnchor="middle" fill="#71717a" fontSize="9px" fontWeight="black" fontFamily="monospace">{(name || type || '').toUpperCase()}</text>
      {safePins.map((p, i) => {
        const px = 15 + i * 18;
        return (
          <g key={`f-${i}`}>
            <rect x={px-1} y={90} width="2" height="10" fill="#fbbf24" />
            <circle cx={px} cy={100} r="3" fill="#f59e0b" stroke="#fff" strokeWidth="0.5" />
            <text x={px} y={85} textAnchor="end" transform={`rotate(90, ${px}, 85)`} fill="#a1a1aa" fontSize="7px" fontWeight="bold">{p}</text>
          </g>
        );
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
        if (!conn?.from?.includes(':') || !conn?.to?.includes(':')) return;
        const [fP, fPin] = conn.from.split(':');
        const [tP, tPin] = conn.to.split(':');
        if (!fP || !fPin || !tP || !tPin) return;

        if (!partPins[fP]) partPins[fP] = new Set();
        if (!partPins[tP]) partPins[tP] = new Set();
        partPins[fP].add(fPin); partPins[tP].add(tPin);
      });
    }

    const uniquePartsMap = new Map();
    (diagram.parts || []).forEach(p => { if (p.id) uniquePartsMap.set(p.id, p); });
    Object.keys(partPins).forEach(id => {
      if (!uniquePartsMap.has(id)) uniquePartsMap.set(id, { id, type: id, name: id.toUpperCase() });
    });
    const completeParts = Array.from(uniquePartsMap.values());

    let counts = { mcu: 0, out: 0, mid: 0 };
    const partsWithPos = completeParts.map((p) => {
      const t = String(p.type || '').toLowerCase();
      const isMcu = t.includes('esp') || t.includes('uno') || t.includes('arduino');
      const isOutput = t.includes('lcd') || t.includes('led') || t.includes('servo') || t.includes('buzzer');
      
      let x = 350, y = 60;
      if (isMcu) { 
        x = 300; 
        y = 380 + (counts.mcu * 160); 
        counts.mcu++; 
      } else if (isOutput) { 
        x = 60 + (counts.out % 2) * 550; 
        y = 60 + Math.floor(counts.out / 2) * 140;
        counts.out++; 
      } else { 
        x = 60 + (counts.mid * 200); 
        y = 240; 
        counts.mid++; 
      }

      return { ...p, pins: Array.from(partPins[p.id] || []), x, y };
    });

    const getPinPos = (pId, pName) => {
      const p = partsWithPos.find(part => part.id === pId);
      if (!p) return { x: 0, y: 0 };
      const t = String(p.type || '').toLowerCase();
      const safePins = Array.isArray(p.pins) ? p.pins : [];
      const idx = Math.max(0, safePins.indexOf(pName));
      const px = Number(p.x) || 0;
      const py = Number(p.y) || 0;

      if (t.includes('led')) return { x: px + (idx === 0 ? 15 : 25), y: py + 30 };
      if (t.includes('button')) {
        const coords = [{x:0, y:12}, {x:0, y:38}, {x:50, y:12}, {x:50, y:38}];
        const c = coords[idx % 4] || coords[0];
        return { x: px + c.x, y: py + c.y };
      }
      if (t.includes('uno') || t.includes('arduino')) {
        return { x: px + 78 + (idx % 10) * 12, y: py + (idx < 10 ? 12 : 138) };
      }
      if (t.includes('lcd')) return { x: px + 35 + (idx % 16) * 11, y: py + 101 };
      if (t.includes('servo')) return { x: px + 90, y: py + 12 + (idx * 6) };
      if (t.includes('ultra')) return { x: px + 35 + (idx * 10), y: py + 55 };
      if (t.includes('dht')) return { x: px + 15 + (idx * 10), y: py + 85 };
      if (t.includes('esp')) {
        const half = Math.max(1, Math.ceil(safePins.length / 2));
        const sideIdx = idx % half;
        const isLeft = idx < half;
        return { x: px + (isLeft ? 6 : 104), y: py + 30 + (sideIdx * 16) };
      }
      // Generic Module Fallback Pin
      return { x: px + 15 + (idx * 18), y: py + 100 };
    };

    const renderWire = (start, end) => {
      const sx = Number(start.x) || 0; const sy = Number(start.y) || 0;
      const ex = Number(end.x) || 0; const ey = Number(end.y) || 0;
      const midY = (sy + ey) / 2 + (sy < ey ? 40 : -40);
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

          {partsWithPos.map((p, i) => (
            <motion.g key={`comp-${p.id}-${i}`} transform={`translate(${p.x || 0}, ${p.y || 0})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ComponentIcon type={p.type} name={p.name} id={p.id} pins={p.pins} />
            </motion.g>
          ))}

          {Array.isArray(diagram.connections) && diagram.connections.map((conn, i) => {
            if (!conn?.from?.includes(':') || !conn?.to?.includes(':')) return null;
            const s = getPinPos(conn.from.split(':')[0], conn.from.split(':')[1]);
            const e = getPinPos(conn.to.split(':')[0], conn.to.split(':')[1]);
            const color = conn.color === 'auto' ? '#3b82f6' : (conn.color || '#3b82f6');
            return (
              <React.Fragment key={`w-frag-${i}`}>
                <motion.path d={renderWire(s, e)} stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round" opacity="0.9"
                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                 style={{ filter: "url(#shadow)" }} />
                <circle cx={s.x} cy={s.y} r="3" fill={color} stroke="#fff" strokeWidth="0.5" />
                <circle cx={e.x} cy={e.y} r="3" fill={color} stroke="#fff" strokeWidth="0.5" />
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    );
  } catch (err) {
    console.error("Diagram Render Error:", err);
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#18181b] p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-xs">
          <p className="text-red-400 text-sm font-bold mb-2 uppercase tracking-widest font-mono">Sim Error</p>
          <p className="text-zinc-500 text-[10px] mb-1 font-mono">{err.message}</p>
          <p className="text-zinc-400 text-[9px]">The circuit layout contains invalid SVG data. Describe your project again to reset.</p>
        </div>
      </div>
    );
  }
}
