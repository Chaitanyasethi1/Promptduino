import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getPinColor = (pinName) => {
  if (pinName === 'VCC' || pinName === '5V' || pinName === '3V3') return '#dc2626';
  if (pinName === 'GND') return '#171717';
  return '#fcd34d';
};

const ComponentIcon = ({ type, color, name, pins }) => {
  const typeLower = type?.toLowerCase() || '';
  const isMicrocontroller = typeLower.includes('arduino') || typeLower.includes('esp') || typeLower.includes('nano');
  const isBreadboard = typeLower.includes('breadboard');

  // Draw universal components dynamically based on pins
  const pinCount = pins.length || 4;
  const width = isBreadboard ? 300 : Math.max(120, pinCount * 22);
  const height = isBreadboard ? 60 : 45;

  return (
    <g>
      {/* High Quality Component Body */}
      <rect width={width} height={height} rx="4" fill={isMicrocontroller ? "#1e3a8a" : (isBreadboard ? "#f3f4f6" : "#0369a1")} stroke={isMicrocontroller ? "#172554" : (isBreadboard ? "#d1d5db" : "#075985")} strokeWidth="2.5" />
      <rect x="2" y="2" width={width-4} height={height-4} rx="2" fill={isMicrocontroller ? "#2563eb" : (isBreadboard ? "#fff" : "#0ea5e9")} />
      
      {/* Label */}
      <text x={width/2} y={height/2 + (isBreadboard ? 0 : 4)} textAnchor="middle" fill={isBreadboard ? "#94a3b8" : "#fff"} fontSize={isBreadboard ? "12px" : "10px"} fontWeight="bold" fontFamily="monospace">
        {(name || type).toUpperCase()}
      </text>
      
      {/* Dynamic Rendered Pins */}
      {pins.map((pin, i) => {
        const pinX = 12 + (i * 22);
        if (pinX > width - 10) return null; // Avoid overflowing pins
        return (
          <g key={pin}>
            <rect x={pinX} y={height} width="3" height="10" fill="#fbbf24" />
            <circle cx={pinX+1.5} cy={height+14} r="3" fill="#d97706" />
            <text x={pinX+1.5} y={height-5} textAnchor="middle" fill="#0f172a" fontSize="7px" fontWeight="bold">{pin}</text>
          </g>
        );
      })}
    </g>
  );
};

export default function CircuitDiagram({ diagram }) {
  if (!diagram || !diagram.parts) return null;

  // 1. Analyze pins and connections
  const partPins = {};
  if (diagram.connections) {
    diagram.connections.forEach(conn => {
      if (!conn.from || !conn.to) return;
      const [fromPart, fromPin] = conn.from.split(':');
      const [toPart, toPin] = conn.to.split(':');
      
      if (fromPart && fromPin) {
        if (!partPins[fromPart]) partPins[fromPart] = new Set();
        partPins[fromPart].add(fromPin);
      }
      if (toPart && toPin) {
        if (!partPins[toPart]) partPins[toPart] = new Set();
        partPins[toPart].add(toPin);
      }
    });
  }

  // 2. Synthesize missing parts and compute Smart Auto-Layout
  const completeParts = [...(diagram.parts || [])];
  
  // Synthesize any parts found in connections but missing from the parts array
  Object.keys(partPins).forEach(partId => {
    if (!completeParts.find(p => p.id === partId)) {
      completeParts.push({ id: partId, type: partId, name: partId.toUpperCase() });
    }
  });

  let mcuCount = 0;
  let inputCount = 0;
  let outputCount = 0;

  const partsWithPos = completeParts.map((part) => {
    const typeStr = part.type?.toLowerCase() || '';
    const nameStr = part.name?.toLowerCase() || '';
    const idStr = part.id?.toLowerCase() || '';
    const isMcu = typeStr.includes('arduino') || typeStr.includes('esp') || idStr.includes('esp') || idStr.includes('uno');
    const isOutput = typeStr.includes('led') || typeStr.includes('buzzer') || typeStr.includes('lcd') || typeStr.includes('display') || nameStr.includes('screen');
    
    let xStrata = 320;
    let yDelta = 40;
    
    if (isMcu) {
      xStrata = 60;
      yDelta = 100 + (mcuCount * 220);
      mcuCount++;
    } else if (isOutput) {
      xStrata = 580;
      yDelta = 60 + (outputCount * 160);
      outputCount++;
    } else {
      xStrata = 320; // Sensor/Middle
      yDelta = 60 + (inputCount * 160);
      inputCount++;
    }
    
    return {
      ...part,
      pins: Array.from(partPins[part.id] || []),
      x: xStrata,
      y: yDelta,
    };
  });

  const getPinPos = (partId, pinName) => {
    const part = partsWithPos.find(p => p.id === partId);
    if (!part) return { x: 0, y: 0 };
    
    // Dynamic Generic Pins (Bottom Edge)
    const pinIndex = part.pins.indexOf(pinName);
    const pinX = part.x + 12 + (Math.max(pinIndex, 0) * 22) + 1.5;
    const isBreadboard = part.type?.toLowerCase().includes('breadboard');
    const pinY = part.y + (isBreadboard ? 60 : 45) + 14; 
    
    return { x: pinX, y: pinY };
  };

  // 3. Create Orthogonal Manhattan routing with TIERED LANS
  const renderWire = (start, end, idx) => {
    // Determine a shared horizontal 'highway' vertical coordinate
    // We use the lowest component's bottom + a tiered offset based on wire index
    const baselineY = Math.max(start.y, end.y) + 60;
    const midY = baselineY + (idx * 6);
    
    return `M ${start.x} ${start.y} 
            L ${start.x} ${midY} 
            L ${end.x} ${midY} 
            L ${end.x} ${end.y}`;
  };

  return (
    <svg className="w-full h-full min-h-[450px]" viewBox="0 0 850 600">
      <defs>
        <pattern id="dot-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.4"/>
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#dot-grid)" />

      {/* Wires Layer */}
      {diagram.connections && diagram.connections.map((conn, idx) => {
        if (!conn.from || !conn.to) return null;
        const [fromPart, fromPin] = conn.from.split(':');
        const [toPart, toPin] = conn.to.split(':');
        
        const start = getPinPos(fromPart, fromPin);
        const end = getPinPos(toPart, toPin);

        let wireColor = conn.color;
        if (!wireColor || wireColor === 'auto') {
           const pLower = (fromPin + toPin).toLowerCase();
           if (pLower.includes('gnd')) wireColor = '#000';
           else if (pLower.includes('vcc') || pLower.includes('5v') || pLower.includes('3v3')) wireColor = '#ef4444';
           else wireColor = `hsl(${(idx * 40) % 360}, 70%, 45%)`; // Distinct colors for signals
        }

        return (
          <motion.path
            key={`wire-${idx}`}
            d={renderWire(start, end, idx)}
            stroke={wireColor}
            strokeWidth="2.2"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(1px 2px 3px rgb(0 0 0 / 0.15))" }}
          />
        );
      })}

      {/* Components Layer */}
      {partsWithPos.map((part) => (
        <motion.g
          key={part.id}
          initial={{ x: part.x, y: part.y - 30, opacity: 0 }}
          animate={{ x: part.x, y: part.y, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        >
          <ComponentIcon type={part.type} color={part.color} name={part.name} pins={part.pins} />
        </motion.g>
      ))}
    </svg>
  );
}
