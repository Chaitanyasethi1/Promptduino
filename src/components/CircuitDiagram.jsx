import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getPinColor = (pinName) => {
  if (pinName === 'VCC' || pinName === '5V' || pinName === '3V3') return '#dc2626';
  if (pinName === 'GND') return '#171717';
  return '#fcd34d';
};

const ComponentIcon = ({ type, color, name, pins }) => {
  const isMicrocontroller = type?.toLowerCase().includes('arduino') || type?.toLowerCase().includes('esp') || type?.toLowerCase().includes('nano');
  
  if (isMicrocontroller) {
    return (
      <g>
        <rect width="140" height="100" rx="6" fill={type?.includes('esp') ? "#1f2937" : "#0f172a"} stroke={type?.includes('esp') ? "#374151" : "#1e293b"} strokeWidth="2.5" />
        <rect x="-10" y="20" width="10" height="20" rx="2" fill="#d1d5db" />
        <rect x="25" y="5" width="90" height="8" rx="1" fill="#000" />
        <rect x="25" y="87" width="90" height="8" rx="1" fill="#000" />
        <text x="70" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="10px" fontWeight="bold" fontFamily="monospace">{type?.toUpperCase()}</text>
        <circle cx="120" cy="50" r="15" fill="#334155" />
        <circle cx="120" cy="50" r="12" fill="#1e293b" />
      </g>
    );
  }

  // Draw universal components dynamically based on pins
  const pinCount = pins.length || 4;
  const width = Math.max(60, pinCount * 15);
  const height = 45;

  return (
    <g>
      {/* High Quality Component Body */}
      <rect width={width} height={height} rx="4" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
      <rect x="2" y="2" width={width-4} height={height-4} rx="2" fill="#38bdf8" />
      <text x={width/2} y={20} textAnchor="middle" fill="#fff" fontSize="8px" fontWeight="bold" fontFamily="monospace">
        {(name || type).substring(0, 10).toUpperCase()}
      </text>
      
      {/* Dynamic Rendered Pins */}
      {pins.map((pin, i) => {
        const pinX = 10 + (i * 15);
        return (
          <g key={pin}>
            <rect x={pinX} y={height} width="2" height="6" fill="#fbbf24" />
            <circle cx={pinX+1} cy={height+8} r="2" fill="#d97706" />
            <text x={pinX+1} y={height-5} textAnchor="middle" fill="#0f172a" fontSize="5px" fontWeight="bold">{pin}</text>
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
    const idStr = part.id?.toLowerCase() || '';
    const isMcu = typeStr.includes('arduino') || typeStr.includes('esp') || idStr.includes('esp') || idStr.includes('uno');
    const isOutput = typeStr.includes('led') || typeStr.includes('buzzer') || typeStr.includes('lcd') || typeStr.includes('display');
    
    let xStrata = 250;
    let yDelta = 40;
    
    if (isMcu) {
      xStrata = 50;
      yDelta = 100 + (mcuCount * 160);
      mcuCount++;
    } else if (isOutput) {
      xStrata = 480;
      yDelta = 40 + (outputCount * 120);
      outputCount++;
    } else {
      xStrata = 260; // Sensor/Middle
      yDelta = 40 + (inputCount * 120);
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
    
    // MCU specific hardcoded pins (approximations for realistic boards)
    if (part.type?.toLowerCase().includes('arduino') || part.type?.toLowerCase().includes('esp')) {
      if (pinName.toLowerCase() === 'gnd') return { x: part.x + 115, y: part.y + 87, dir: 'down' };
      if (pinName.toLowerCase() === '5v' || pinName.toLowerCase() === '3v3') return { x: part.x + 100, y: part.y + 87, dir: 'down' };
      
      // Attempt to map remaining pins across the upper row
      const pseudoIndex = pinName.length * 5;
      return { x: part.x + 30 + (pseudoIndex % 80), y: part.y + 5, dir: 'up' };
    }

    // Dynamic Generic Pins (Bottom Edge)
    const pinIndex = part.pins.indexOf(pinName);
    const pinX = part.x + 10 + (Math.max(pinIndex, 0) * 15) + 1;
    const pinY = part.y + 45 + 8; // Adjust for the pin rendering offset
    
    return { x: pinX, y: pinY, dir: 'down' };
  };

  // 3. Create Orthogonal Manhattan routing for Wires
  const renderWire = (start, end, color) => {
    // Avoid completely overlapping lines by adding a tiny random offset
    const offset = Math.floor(Math.random() * 10) - 5;
    
    // Calculate a midway breaking point to make a nice schematic corner
    const midY = start.y + (end.y - start.y) / 2 + offset;
    
    const d = `M ${start.x} ${start.y} 
               L ${start.x} ${midY} 
               L ${end.x} ${midY} 
               L ${end.x} ${end.y}`;

    return d;
  };

  return (
    <svg className="w-full h-full min-h-[400px]" viewBox="0 0 650 500">
      <defs>
        <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#cbd5e1" opacity="0.6"/>
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
           if (fromPin === 'GND' || toPin === 'GND') wireColor = '#171717';
           else if (fromPin === '5V' || toPin === '3V3') wireColor = '#dc2626';
           else wireColor = '#2563eb'; // Default signal color
        }

        return (
          <motion.path
            key={`wire-${idx}`}
            d={renderWire(start, end)}
            stroke={wireColor}
            strokeWidth="2.5"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(1px 2px 2px rgb(0 0 0 / 0.2))" }}
          />
        );
      })}

      {/* Components Layer */}
      {partsWithPos.map((part) => (
        <motion.g
          key={part.id}
          initial={{ x: part.x, y: part.y - 20, opacity: 0 }}
          animate={{ x: part.x, y: part.y, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        >
          <ComponentIcon type={part.type} color={part.color} name={part.name} pins={part.pins} />
        </motion.g>
      ))}
    </svg>
  );
}
