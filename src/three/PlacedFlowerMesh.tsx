import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import type { Flower, PlacedFlower } from '../data/types'
import FlowerBloom3D from './FlowerBloom3D'

interface PlacedFlowerMeshProps {
  item: PlacedFlower
  flower: Flower
  selected: boolean
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void
}

const deg = (d: number) => (d * Math.PI) / 180

/**
 * One flower placed in the scene. Orientation is two nested rotations so the
 * two sliders behave the way a person expects: `rotationY` (outer group) is
 * the compass direction the flower leans toward, and `tilt` (inner group,
 * rotated inside that already-yawed frame) is how far it leans away from
 * standing straight up — together they let the bloom face any direction in
 * space, not just spin flat in place. Nesting them is what makes tilt's lean
 * axis follow rotationY instead of the two fighting each other.
 */
export default function PlacedFlowerMesh({ item, flower, selected, onPointerDown }: PlacedFlowerMeshProps) {
  return (
    <group position={[item.x, item.y, item.z]} onPointerDown={onPointerDown}>
      <group rotation={[0, deg(item.rotationY), 0]}>
        <group rotation={[deg(item.tilt), 0, 0]} scale={item.scale}>
          <FlowerBloom3D shape={flower.shape} petalColor={flower.petalColor} centerColor={flower.centerColor} petalCount={flower.petalCount} />
        </group>

        <mesh position={[0, 0.24 * item.scale, 0]}>
          <sphereGeometry args={[0.38 * item.scale, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {selected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} scale={item.scale}>
            <ringGeometry args={[0.3, 0.37, 28]} />
            <meshBasicMaterial color="#FFA26E" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </group>
  )
}
