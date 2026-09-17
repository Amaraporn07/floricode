import { useState } from 'react'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { BouquetState } from '../hooks/useBouquet'
import { getFlowerById } from '../data/flowers'
import WrapCone3D from './WrapCone3D'
import RibbonBow3D from './RibbonBow3D'
import StemTube3D from './StemTube3D'
import PlacedFlowerMesh from './PlacedFlowerMesh'

interface BouquetSceneProps {
  state: BouquetState
  selectedUid: string | null
  onSelect: (uid: string | null) => void
  onMove: (uid: string, x: number, z: number) => void
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}

/** An invisible plane at the dragged flower's height — pointer moves over it
 * report their world-space intersection point, which becomes the flower's
 * new x/z. Only mounted while something is actually being dragged. */
function DragPlane({ y, onMove, onUp }: { y: number; onMove: (x: number, z: number) => void; onUp: () => void }) {
  return (
    <mesh
      position={[0, y, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(e) => {
        e.stopPropagation()
        onMove(e.point.x, e.point.z)
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        onUp()
      }}
    >
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function SceneContents({ state, selectedUid, onSelect, onMove }: Omit<BouquetSceneProps, 'onCanvasReady'>) {
  const [draggingUid, setDraggingUid] = useState<string | null>(null)
  const draggingItem = state.placed.find((p) => p.uid === draggingUid)

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3.2, 2]} intensity={1.1} castShadow />
      <directionalLight position={[-2.2, 1.4, -1.4]} intensity={0.5} />
      <hemisphereLight args={['#fff6ec', '#e9d7b8', 0.7]} />

      <WrapCone3D color={state.wrapColor} pattern={state.wrapPattern} fold={state.wrapFold} />
      <RibbonBow3D color={state.ribbonColor} fabric={state.ribbonFabric} position={state.ribbonPosition} size={state.ribbonSize} />
      <StemTube3D items={state.placed} />

      {state.placed.map((item) => {
        const flower = getFlowerById(item.flowerId)
        if (!flower) return null
        return (
          <PlacedFlowerMesh
            key={item.uid}
            item={item}
            flower={flower}
            selected={selectedUid === item.uid}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation()
              onSelect(item.uid)
              setDraggingUid(item.uid)
            }}
          />
        )
      })}

      {draggingItem && <DragPlane y={draggingItem.y} onMove={(x, z) => onMove(draggingItem.uid, x, z)} onUp={() => setDraggingUid(null)} />}

      {/* clicking empty space deselects — a large invisible shell around the whole scene */}
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation()
          onSelect(null)
        }}
      >
        <sphereGeometry args={[8, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

/** The full 3D bouquet scene: wrap cone, ribbon, stems and flowers, orbitable
 * a full 360° with the mouse/touch. */
export default function BouquetScene({ state, selectedUid, onSelect, onMove, onCanvasReady }: BouquetSceneProps) {
  return (
    <Canvas
      shadows
      flat
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: [0, 1.25, 2.9], fov: 38 }}
      onCreated={({ gl }) => onCanvasReady(gl.domElement)}
    >
      <color attach="background" args={['#fff8f0']} />
      <SceneContents state={state} selectedUid={selectedUid} onSelect={onSelect} onMove={onMove} />
      <OrbitControls target={[0, 0.75, 0]} enablePan={false} minDistance={1.6} maxDistance={5.5} minPolarAngle={0.1} maxPolarAngle={Math.PI - 0.1} />
    </Canvas>
  )
}
