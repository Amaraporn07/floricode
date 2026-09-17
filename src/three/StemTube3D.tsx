import { useMemo } from 'react'
import * as THREE from 'three'
import type { PlacedFlower } from '../data/types'

const NECK = new THREE.Vector3(0, 0, 0)
const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)

// Every FlowerBloom3D is built with its own local origin as its natural base
// (petals/spike/branch stems all grow upward *from* that point along local
// +Y), so the stem's job is to arrive at that point already travelling in
// the SAME direction the flower leans — matching PlacedFlowerMesh's own
// rotation order (tilt applied first, then yaw) so the two agree. Without
// this, a tilted/rotated flower's own local "up" pointed one way while the
// stem always curved in vertically from below, so the stem visibly kinked
// away from the flower instead of leading smoothly into it.
function Stem({ item }: { item: PlacedFlower }) {
  const geometry = useMemo(() => {
    const position = new THREE.Vector3(item.x, item.y, item.z)
    const dir = new THREE.Vector3(0, 1, 0)
      .applyAxisAngle(X_AXIS, (item.tilt * Math.PI) / 180)
      .applyAxisAngle(Y_AXIS, (item.rotationY * Math.PI) / 180)

    // A point just "before" the flower along its own lean axis, so the
    // curve's final segment is parallel to that axis on arrival.
    const preAttach = position.clone().sub(dir.clone().multiplyScalar(0.2))
    const mid = NECK.clone().lerp(preAttach, 0.55)
    mid.y -= 0.1

    const curve = new THREE.CatmullRomCurve3([NECK, mid, preAttach, position])
    return new THREE.TubeGeometry(curve, 20, 0.011, 6, false)
  }, [item.x, item.y, item.z, item.tilt, item.rotationY])

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
