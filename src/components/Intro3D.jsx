import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, MeshTransmissionMaterial, ContactShadows, Text, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

function AbstractCore() {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    wireRef.current.rotation.x -= delta * 0.15;
    wireRef.current.rotation.y -= delta * 0.2;
  });

  return (
    <group>
      {/* Inner glowing core */}
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={2} 
          chromaticAberration={0.05} 
          anisotropy={0.1} 
          distortion={0.5} 
          distortionScale={0.1} 
          temporalDistortion={0.1} 
          color="#6392A8" 
          transmission={1} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Outer Anti-gravity wireframe */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color="#3A3A3A" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function Intro3D({ onStartApp }) {
  const [showButton, setShowButton] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Show the "Initialize" button after 2.5 seconds of 3D animation
    const timer = setTimeout(() => setShowButton(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setClicked(true);
    // Add a slight delay before unmounting to allow exit animations
    setTimeout(() => {
      onStartApp();
    }, 1500);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F3EC]"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 cursor-pointer" onClick={showButton ? handleStart : undefined}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} shadows>
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <AbstractCore />
            <Text
              position={[0, -0.2, 0]}
              fontSize={0.6}
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff"
              letterSpacing={0.2}
              color="#3A3A3A"
              fillOpacity={clicked ? 0 : 0.8}
            >
              PROMPTDUINO
            </Text>
          </Float>

          <Sparkles count={100} scale={10} size={2} color="#6392A8" speed={0.4} opacity={0.4} />
          <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2.5} far={4} color="#3A3A3A" />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <AnimatePresence>
        {showButton && !clicked && (
          <motion.div 
            className="absolute bottom-20 flex flex-col items-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <button 
              onClick={handleStart}
              className="pointer-events-auto px-8 py-3 bg-[#3A3A3A] text-[#F5F3EC] rounded-full tracking-widest text-sm font-medium hover:bg-[#6392A8] transition-colors duration-500 shadow-xl shadow-[#3A3A3A]/20"
            >
              INITIALIZE SYSTEM
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
