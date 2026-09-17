import { useMemo } from 'react'
import * as THREE from 'three'
import type { PlacedFlower } from '../data/types'

const NECK = new THREE.Vector3(0, 0, 0)

// Every FlowerBloom3D is built with its own local origin as its natural base
// (petals/spike/branch stems all grow upward *from* that point) — unlike the
// 2D SVG icons, there's no per-shape offset to reason about here, so every
// stem simply runs from the flower's placed position straight to the shared
// neck point at the wrap cone's opening.
function Stem({ item }: { item: PlacedFlower }) {
  const geometry = useMemo(() => {
    const start = new THREE.Vector3(item.x, item.y, item.z)
    const mid = start.clone().lerp(NECK, 0.5)
    mid.y -= 0.12
    const curve = new THREE.CatmullRomCurve3([start, mid, NECK])
    return new THREE.TubeGeometry(curve, 16, 0.011, 6, false)
  }, [item.x, item.y, item.z])

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color="#7FA06A" roughness={0.7} />
    </mesh>
  )
}

export default function StemTube3D({ items }: { items: PlacedFlower[] }) {
  return (
    <group>
      {items.map((item) => (
        <Stem key={item.uid} item={item} />
      ))}
    </group>
  )
}
