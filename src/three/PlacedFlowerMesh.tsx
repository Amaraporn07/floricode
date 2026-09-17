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

/** One flower placed in the scene: the procedural bloom, a selection ring
 * underneath it when active, and an invisible larger sphere so thin petal
 * geometry is still easy to click/drag on a small screen. */
export default function PlacedFlowerMesh({ item, flower, selected, onPointerDown }: PlacedFlowerMeshProps) {
  return (
    <group position={[item.x, item.y, item.z]} rotation={[0, deg(item.rotationY), 0]} scale={item.scale} onPointerDown={onPointerDown}>
      <FlowerBloom3D shape={flower.shape} petalColor={flower.petalColor} centerColor={flower.centerColor} petalCount={flower.petalCount} />

      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.38, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[0.3, 0.37, 28]} />
          <meshBasicMaterial color="#FFA26E" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}
