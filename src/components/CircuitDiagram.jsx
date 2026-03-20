import React from 'react';
import { motion } from 'framer-motion';

const ComponentIcon = ({ type, color = "#6392A8", name }) => {
  const isMicrocontroller = type?.toLowerCase().includes('arduino') || type?.toLowerCase().includes('esp') || type?.toLowerCase().includes('nano');
  
  if (isMicrocontroller) {
    return (
      <g>
        <rect width="140" height="100" rx="6" fill={type?.includes('esp') ? "#333" : "#1E477A"} stroke="#2D608F" strokeWidth="2.5" />
        <rect x="-10" y="15" width="30" height="25" rx="2" fill="#71717A" />
        <rect x="-10" y="65" width="25" height="20" rx="2" fill="#27272A" />
        <rect x="50" y="35" width="60" height="15" rx="1" fill="#18181B" />
        <rect x="25" y="5" width="100" height="10" rx="1" fill="#000" />
        <text x="75" y="13" textAnchor="middle" fill="#FFF" fontSize="6px" fontWeight="bold">IO PINS</text>
        <rect x="25" y="85" width="100" height="10" rx="1" fill="#000" />
        <text x="75" y="93" textAnchor="middle" fill="#FFF" fontSize="6px" fontWeight="bold">{type?.toUpperCase()}</text>
      </g>
    );
  }

  switch (type?.toLowerCase()) {
    case 'led':
      return (
        <g>
          <rect x="13" y="15" width="1.5" height="15" fill="#A1A1AA" />
          <rect x="15.5" y="15" width="1.5" height="15" fill="#A1A1AA" />
          <path d="M7 15 Q 15 -5 23 15 L 23 20 L 7 20 Z" fill={color || "#EF4444"} stroke="#000" strokeWidth="0.5" />
          <circle cx="15" cy="10" r="3" fill="#FFF" fillOpacity="0.4" />
        </g>
      );
    case 'ultrasonic':
    case 'hc-sr04':
      return (
        <g>
           <rect width="60" height="30" rx="2" fill="#2563EB" />
           <circle cx="15" cy="15" r="10" fill="#E5E7EB" stroke="#1E40AF" />
           <circle cx="45" cy="15" r="10" fill="#E5E7EB" stroke="#1E40AF" />
           <text x="30" y="27" textAnchor="middle" fill="#FFF" fontSize="5px">S-SONIC</text>
        </g>
      );
    case 'buzzer':
      return (
        <g>
          <circle cx="15" cy="15" r="15" fill="#18181B" stroke="#000" />
          <circle cx="15" cy="15" r="5" fill="#27272A" stroke="#000" />
        </g>
      );
    case 'servo':
      return (
        <g>
          <rect width="40" height="20" rx="2" fill="#1E40AF" />
          <circle cx="10" cy="10" r="6" fill="#FFF" stroke="#1D4ED8" />
          <rect x="4" y="9" width="12" height="2" fill="#D1D5DB" />
        </g>
      );
    default:
      return (
        <g>
          <rect width="60" height="45" rx="4" fill="#EFECE1" stroke="#A3B0A3" strokeWidth="2" strokeDasharray="2 1" />
          <circle cx="30" cy="20" r="10" fill="#6392A8" fillOpacity="0.1" />
          <rect x="10" y="38" width="40" height="2" fill="#E0DCD1" />
          <text x="30" y="24" textAnchor="middle" fill="#7A7870" fontSize="7px" fontWeight="bold">{type?.substring(0,6).toUpperCase()}</text>
        </g>
      );
  }
};

export default function CircuitDiagram({ diagram }) {
  if (!diagram || !diagram.parts) return null;

  // Simple layout logic for parts
  const partsWithPos = diagram.parts.map((part, index) => ({
    ...part,
    x: part.x || (part.type === 'arduino-uno' ? 50 : 250 + (index % 3) * 100),
    y: part.y || (part.type === 'arduino-uno' ? 100 : 50 + Math.floor(index / 3) * 100),
  }));

  const getPinPos = (partId, pinName) => {
    const part = partsWithPos.find(p => p.id === partId);
    if (!part) return { x: 0, y: 0 };
    
    // Detailed pin offsets for Arduino Uno
    if (part.type === 'arduino-uno') {
      if (pinName.startsWith('D')) {
        const pinNum = parseInt(pinName.substring(1));
        return { x: part.x + 125 - (pinNum * 7), y: part.y + 10 };
      }
      if (pinName.startsWith('A')) {
        const pinNum = parseInt(pinName.substring(1));
        return { x: part.x + 30 + (pinNum * 8), y: part.y + 90 };
      }
      if (pinName === 'GND') return { x: part.x + 100, y: part.y + 90 };
      if (pinName === '5V') return { x: part.x + 115, y: part.y + 90 };
      return { x: part.x + 140, y: part.y + 50 };
    }

    // Default for sensors
    return { x: part.x + 30, y: part.y + 30 };
  };

  return (
    <svg className="w-full h-full min-h-[300px]" viewBox="0 0 600 400">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7A7870" />
        </marker>
      </defs>

      {/* Grid background */}
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E0DCD1" strokeWidth="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Connections (Wires) */}
      {diagram.connections && diagram.connections.map((conn, idx) => {
        const [fromPart, fromPin] = conn.from.split(':');
        const [toPart, toPin] = conn.to.split(':');
        const start = getPinPos(fromPart, fromPin);
        const end = getPinPos(toPart, toPin);

        return (
          <motion.path
            key={`conn-${idx}`}
            d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
            stroke={conn.color || "#4A90E2"}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: idx * 0.1 }}
          />
        );
      })}

      {/* Parts */}
      {partsWithPos.map((part) => (
        <motion.g
          key={part.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          transform={`translate(${part.x}, ${part.y})`}
        >
          <ComponentIcon type={part.type} color={part.color} />
          <text
            x="0"
            y={part.type === 'arduino-uno' ? 95 : 55}
            className="text-[10px] font-bold fill-[#7A7870] uppercase tracking-wider"
          >
            {part.name || part.type}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
