import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CosmicCanvas() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mount.current) return;
    const host = mount.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setSize(innerWidth, innerHeight);
    host.appendChild(renderer.domElement);
    const count = innerWidth < 700 ? 420 : 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xe9b984, size: 0.018, transparent: true, opacity: 0.72 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    let frame = 0;
    const render = () => { stars.rotation.y += 0.00018; stars.rotation.x += 0.00006; renderer.render(scene, camera); frame = requestAnimationFrame(render); };
    render();
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); geometry.dispose(); material.dispose(); renderer.dispose(); host.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mount} className="cosmic-canvas" aria-hidden="true" />;
}
