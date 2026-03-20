import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getPinColor = (pinName) => {
  if (pinName === 'VCC' || pinName === '5V' || pinName === '3V3') return '#dc2626';
  if (pinName === 'GND') return '#171717';
  return '#fcd34d';
};

const ComponentIcon = ({ type, id, name, pins }) => {
  const typeLower = type?.toLowerCase() || '';
  const isEsp = typeLower.includes('esp32');
  const isArduino = typeLower.includes('arduino') || typeLower.includes('uno');
  const isBreadboard = typeLower.includes('breadboard') || typeLower.includes('board');

  if (isEsp) {
    // Realistic ESP32 DevKit Layout
    return (
      <g>
        {/* Black PCB */}
        <rect width="140" height="260" rx="4" fill="#121212" stroke="#2a2a2a" strokeWidth="2" />
        {/* Silver Module Shield (ESP-WROOM-32) */}
        <rect x="35" y="10" width="70" height="60" rx="3" fill="#a1a1aa" stroke="#71717a" />
        <rect x="50" y="25" width="40" height="30" rx="2" fill="#52525b" />
        <text x="70" y="45" textAnchor="middle" fill="#d4d4d8" fontSize="6px" fontWeight="bold">ESP32-WROOM</text>
        
        {/* Header Pins Left */}
        {pins.slice(0, Math.ceil(pins.length / 2)).map((pin, i) => {
          const pinY = 80 + (i * 12);
          return (
            <g key={pin}>
              <rect x="2" y={pinY} width="15" height="4" fill="#4b5563" />
              <rect x="0" y={pinY+1} width="2" height="2" fill="#d97706" /> {/* Golden connector dot */}
              <text x="20" y={pinY+3.5} fill="#94a3b8" fontSize="7px" fontWeight="bold" fontFamily="monospace">{pin}</text>
            </g>
          );
        })}
        
        {/* Header Pins Right */}
        {pins.slice(Math.ceil(pins.length / 2)).map((pin, i) => {
          const pinY = 80 + (i * 12);
          return (
            <g key={pin}>
              <rect x="123" y={pinY} width="15" height="4" fill="#4b5563" />
              <rect x="138" y={pinY+1} width="2" height="2" fill="#d97706" />
              <text x="120" y={pinY+3.5} textAnchor="end" fill="#94a3b8" fontSize="7px" fontWeight="bold" fontFamily="monospace">{pin}</text>
            </g>
          );
        })}
        <text x="70" y="245" textAnchor="middle" fill="#fff" fontSize="10px" fontWeight="bold">ESP32 DEVKIT</text>
      </g>
    );
  }

  if (isArduino) {
    // Realistic Arduino Uno Layout
    return (
      <g>
        <rect width="200" height="150" rx="8" fill="#1e3a8a" stroke="#172554" strokeWidth="3" />
        <rect x="10" y="30" width="40" height="30" rx="2" fill="#cbd5e1" stroke="#94a3b8" /> {/* USB Port */}
        <rect x="10" y="90" width="30" height="40" rx="2" fill="#1f2937" /> {/* DC Jack */}
        <rect x="60" y="10" width="120" height="10" rx="1" fill="#111" /> {/* Top Header */}
        <rect x="60" y="130" width="120" height="10" rx="1" fill="#111" /> {/* Bottom Header */}
        <circle cx="150" cy="75" r="30" fill="#1e40af" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        <text x="120" y="80" textAnchor="middle" fill="#fff" fontSize="12px" fontWeight="black" opacity="0.8">ARDUINO UNO</text>

        {/* Dynamic Pins for Arduino mapped to headers */}
        {pins.map((pin, i) => {
          const isTop = i < pins.length / 2;
          const pinX = 65 + ((i % Math.ceil(pins.length/2)) * 12);
          const pinY = isTop ? 10 : 130;
          return (
            <g key={pin}>
              <rect x={pinX} y={pinY} width="8" height="10" fill="#333" />
              <text x={pinX+4} y={isTop ? 28 : 125} textAnchor="middle" fill="#94a3b8" fontSize="7px">{pin}</text>
            </g>
          );
        })}
      </g>
    );
  }

  // Draw universal components dynamically based on pins for sensors/modules
  const pinCount = pins.length || 4;
  const width = isBreadboard ? 300 : Math.max(120, pinCount * 22);
  const height = 45;

  return (
    <g>
      <rect width={width} height={height} rx="4" fill="#0369a1" stroke="#075985" strokeWidth="2.5" />
      <rect x="2" y="2" width={width-4} height={height-4} rx="2" fill="#0ea5e9" />
      <text x={width/2} y={height/2 + 4} textAnchor="middle" fill="#fff" fontSize="10px" fontWeight="bold" fontFamily="monospace">
        {(name || type).toUpperCase()}
      </text>
      {pins.map((pin, i) => {
        const pinX = 12 + (i * 22);
        if (pinX > width - 10) return null;
        return (
          <g key={pin}>
            <rect x={pinX} y={height} width="3" height="10" fill="#fcd34d" />
            <circle cx={pinX+1.5} cy={height+14} r="3.5" fill="#f59e0b" stroke="#fff" strokeWidth="0.5" />
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
      xStrata = 40;
      yDelta = 60 + (mcuCount * 300);
      mcuCount++;
    } else if (isOutput) {
      xStrata = 600;
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
    
    const typeLower = part.type?.toLowerCase() || '';
    const isEsp = typeLower.includes('esp32');
    const isArduino = typeLower.includes('arduino') || typeLower.includes('uno');
    const pinIndex = part.pins.indexOf(pinName);

    if (isEsp) {
      const half = Math.ceil(part.pins.length / 2);
      if (pinIndex < half) {
        return { x: part.x, y: part.y + 80 + (pinIndex * 12) + 2 };
      } else {
        return { x: part.x + 140, y: part.y + 80 + ((pinIndex - half) * 12) + 2 };
      }
    }

    if (isArduino) {
      const half = Math.ceil(part.pins.length / 2);
      const isTop = pinIndex < half;
      return { 
        x: part.x + 65 + ((pinIndex % half) * 12) + 4, 
        y: part.y + (isTop ? 10 : 140) 
      };
    }

    // Dynamic Generic Pins (Bottom Edge)
    const pinX = part.x + 12 + (Math.max(pinIndex, 0) * 22) + 1.5;
    const isBreadboard = typeLower.includes('breadboard');
    const pinY = part.y + (isBreadboard ? 60 : 45) + 14; 
    
    return { x: pinX, y: pinY };
  };

  // 3. Create Orthogonal Manhattan routing with TIERED LANES
  const renderWire = (start, end, idx) => {
    // Determine a shared horizontal 'highway' vertical coordinate
    // For ESP/Arduino boards, we may need a lower baseline to avoid crossing the board itself
    const baselineY = Math.max(start.y, end.y) + 40;
    const midY = baselineY + (idx * 6);
    
    return `M ${start.x} ${start.y} 
            L ${start.x} ${midY} 
            L ${end.x} ${midY} 
            L ${end.x} ${end.y}`;
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 850 600">
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
