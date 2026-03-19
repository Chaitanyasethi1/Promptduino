import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, Stars, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function CinematicCamera() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Elegant, slow parallax
    camera.position.lerp(new THREE.Vector3(mouse.x * 2, mouse.y * 2, 8), 0.02);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function NeuralCore() {
  const mesh = useRef();
  const wire = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(t / 4) / 2;
      mesh.current.rotation.y = t * 0.2;
    }
    if (wire.current) {
      wire.current.rotation.x = -Math.sin(t / 4) / 2;
      wire.current.rotation.y = -t * 0.2;
      wire.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={mesh}>
          <torusKnotGeometry args={[1.8, 0.6, 256, 32]} />
          <MeshDistortMaterial 
            color="#b200ff"
            emissive="#4c00b0"
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.8}
            distort={0.4}
            speed={2}
            transparent
            opacity={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        <mesh ref={wire}>
          <torusKnotGeometry args={[2.0, 0.2, 128, 16]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00bfff"
            emissiveIntensity={4}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Typography() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={[0, -0.5, 0]}>
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhjp-Ek-_EeA.woff"
        fontSize={1}
        letterSpacing={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
      >
        PROMPTDUINO
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </Text>
    </Float>
  );
}

export default function Intro3D({ onStartApp }) {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    // Show button after a cinematic pause
    const showTimer = setTimeout(() => setStage('ready'), 3500);
    return () => clearTimeout(showTimer);
  }, []);

  const handleStart = () => {
    setStage('leaving');
    // Allow explosion/exit animation to play
    setTimeout(() => {
      onStartApp();
    }, 2000);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'brightness(50) blur(20px)' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 40 }} dpr={[1, 2]} gl={{ antialias: false }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 5, 15]} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
          
          <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />

          <group position={[0, stage === 'leaving' ? -10 : 0, 0]}>
            <NeuralCore />
            <Typography />
          </group>

          <ContactShadows position={[0, -3.5, 0]} scale={20} blur={2} far={4} opacity={0.5} color="#00ffff" />

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>

          <CinematicCamera />
        </Canvas>
      </div>

      <AnimatePresence>
        {stage === 'ready' && (
          <motion.div 
            className="absolute bottom-24 flex flex-col items-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.9, letterSpacing: '0px' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '4px' }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <button 
              onClick={handleStart}
              className="pointer-events-auto px-10 py-4 bg-transparent border border-white/20 text-white rounded-none tracking-[0.3em] text-xs font-light hover:bg-white hover:text-black transition-all duration-700 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)'
              }}
            >
              ENGAGE SYSTEM
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
