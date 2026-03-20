import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getPinColor = (pinName) => {
  if (pinName === 'VCC' || pinName === '5V' || pinName === '3V3') return '#dc2626';
  if (pinName === 'GND') return '#171717';
  return '#fcd34d';
};

const ComponentIcon = ({ type, color, name, pins }) => {
  const isMicrocontroller = type?.toLowerCase().includes('arduino') || type?.toLowerCase().includes('esp') || type?.toLowerCase().includes('nano');

  // Draw universal components dynamically based on pins
  const pinCount = pins.length || 4;
  const width = Math.max(100, pinCount * 20); // Give them wider area so text doesn't mash
  const height = 45;

  return (
    <g>
      {/* High Quality Component Body */}
      <rect width={width} height={height} rx="4" fill={isMicrocontroller ? "#1e40af" : "#0ea5e9"} stroke={isMicrocontroller ? "#1e3a8a" : "#0284c7"} strokeWidth="2" />
      <rect x="2" y="2" width={width-4} height={height-4} rx="2" fill={isMicrocontroller ? "#3b82f6" : "#38bdf8"} />
      <text x={width/2} y={22} textAnchor="middle" fill="#fff" fontSize="9px" fontWeight="bold" fontFamily="monospace">
        {(name || type).toUpperCase()}
      </text>
      
      {/* Dynamic Rendered Pins */}
      {pins.map((pin, i) => {
        const pinX = 10 + (i * 20);
        return (
          <g key={pin}>
            <rect x={pinX} y={height} width="2" height="6" fill="#fbbf24" />
            <circle cx={pinX+1} cy={height+8} r="2" fill="#d97706" />
            <text x={pinX+1} y={height-5} textAnchor="middle" fill="#0f172a" fontSize="6px" fontWeight="bold">{pin}</text>
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
      xStrata = 40;
      yDelta = 100 + (mcuCount * 160);
      mcuCount++;
    } else if (isOutput) {
      xStrata = 520;
      yDelta = 60 + (outputCount * 120);
      outputCount++;
    } else {
      xStrata = 280; // Sensor/Middle
      yDelta = 60 + (inputCount * 120);
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
    const pinX = part.x + 10 + (Math.max(pinIndex, 0) * 20) + 1;
    const pinY = part.y + 45 + 8; // Adjust for the pin rendering offset
    
    return { x: pinX, y: pinY };
  };

  // 3. Create Orthogonal Manhattan routing for Wires
  const renderWire = (start, end, idx) => {
    // Determine the lowest starting point between the two
    const sinkY = Math.max(start.y, end.y);
    
    // Lane distribution: give each wire a guaranteed distinct horizontal line to prevent overlapping bus lines
    const laneOffset = 15 + (idx * 4);
    const midY = sinkY + laneOffset;
    
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
