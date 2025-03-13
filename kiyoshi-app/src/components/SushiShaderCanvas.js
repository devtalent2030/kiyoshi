import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

// 🚀 **3️⃣ Sushi Sphere Effect (Handles Animation & Positioning)**
const SushiSphereEffect = () => {
  const sphereRef = useRef(null);
  const sushiRef = useRef(null);

  // Load the Toronto image as a texture
  const texture = useLoader(THREE.TextureLoader, "/toronto.jpg"); // Adjust path as needed

  useFrame(({ clock, camera }) => {
    // 🔄 Rotate Sphere Slowly
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
      sphereRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.3;
    }

    // 🌐 Orbit "Sushi Icon" around the sphere (faster rotation)
    if (sushiRef.current) {
      const time = clock.getElapsedTime();
      sushiRef.current.position.x = 5 + Math.sin(time * 0.1) * 3.5; // Orbit speed unchanged
      sushiRef.current.position.z = Math.cos(time * 0.1) * 3.5;
      sushiRef.current.position.y = Math.sin(time * 0.05) * 1;
      sushiRef.current.rotation.y += 0.05; // Faster rotation (was 0.005)
    }

    // 🎥 Camera Adjustments to Track Sphere
    camera.position.x = Math.sin(clock.elapsedTime * 0.2) * 3;
    camera.position.y = Math.cos(clock.elapsedTime * 0.1) * 2;
    camera.lookAt(5, 0, 0);
  });

  return (
    <>
      <mesh ref={sphereRef} position={[5, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial map={texture} /> {/* Apply Toronto texture */}
      </mesh>
      {/* ✨ Smaller Sushi-like torus with "Kiyoshi" text inside */}
      <mesh ref={sushiRef}>
        <torusGeometry args={[0.1, 0.05, 16, 32]} /> {/* Smaller size: was [0.2, 0.1] */}
        <meshBasicMaterial color="#ffffff" /> {/* White sushi */}
        <Text
          fontSize={0.03} // Smaller font to fit smaller torus (was 0.06)
          color="#ff4040" // Sushi salmon pink color
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.06]} // Adjusted for smaller torus (was 0.11)
          outlineWidth={0.005} // Adjusted outline for smaller scale
          outlineColor="#000000"
        >
          Kiyoshi
        </Text>
      </mesh>
    </>
  );
};

// 🖥 **4️⃣ Sushi Sphere Canvas (Smaller, Top-Left Placement)**
const SushiSphereCanvas = () => (
  <Canvas
    style={{
      position: "absolute", // Changed to absolute for precise positioning
      top: "60px", // Below a typical header height
      left: "10px", // Small offset from left edge
      width: "200px", // Smaller width
      height: "200px", // Smaller height
      zIndex: 1, // Ensure it’s above other content
    }}
    camera={{ position: [4, 5, 5] }}
  >
    <SushiSphereEffect />
  </Canvas>
);

export default SushiSphereCanvas;