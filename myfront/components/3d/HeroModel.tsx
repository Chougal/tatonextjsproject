"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Sparkles, TorusKnot, Environment, Stars } from '@react-three/drei'

function AnimatedShape() {
  const meshRef = useRef<any>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <TorusKnot ref={meshRef} args={[1, 0.3, 128, 32]}>
        <MeshDistortMaterial
          color="#6c63ff"
          emissive="#6c63ff"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </TorusKnot>
    </Float>
  )
}

function InnerSphere() {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={1}>
      <Sphere args={[0.7, 32, 32]}>
        <meshStandardMaterial
          color="#43d9ad"
          emissive="#43d9ad"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={1}
        />
      </Sphere>
    </Float>
  )
}

export function HeroModel() {
  return (
    <div className="w-full h-[350px] md:h-[500px] relative pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff6584" />
        
        <AnimatedShape />
        <InnerSphere />
        
        <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#ff6584" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
