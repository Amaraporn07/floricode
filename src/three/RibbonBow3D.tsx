import * as THREE from 'three'
import {
  RIBBON_COLORS,
  type RibbonColorId,
  type RibbonFabricId,
  type RibbonPositionId,
  type RibbonSizeId,
} from '../data/options'

interface RibbonBow3DProps {
  color: RibbonColorId
  fabric: RibbonFabricId
  position: RibbonPositionId
  size: RibbonSizeId
}

const SIZE_SCALE: Record<RibbonSizeId, number> = { small: 0.78, medium: 1, large: 1.28 }

// Rough radius of the wrap cone's surface at normalized height t (0 = apex,
// 1 = opening) — just enough to keep the band and bow sitting snugly against
// the cone without needing to share exact geometry with WrapCone3D.
function coneRadiusAt(t: number) {
  return 0.05 + t * 0.5
}

const POSITION_T: Record<RibbonPositionId, number> = { neck: 0.9, middle: 0.55, side: 0.78 }
const POSITION_TILT: Record<RibbonPositionId, [number, number, number]> = {
  neck: [0, 0, 0],
  middle: [0, 0, 0],
  side: [0.22, 0.3, 0.1],
}

export default function RibbonBow3D({ color, fabric, position, size }: RibbonBow3DProps) {
  const colorOption = RIBBON_COLORS.find((c) => c.id === color) ?? RIBBON_COLORS[0]
  const scale = SIZE_SCALE[size]
  const t = POSITION_T[position]
  const y = -1 + t
  const radius = coneRadiusAt(t) + 0.015
  const tilt = POSITION_TILT[position]
  const roughness = fabric === 'satin' ? 0.25 : 0.85
  const sheen = fabric === 'satin' ? 0.3 : 0

  return (
    <group position={[0, y, 0]} rotation={tilt}>
      {/* band around the cone */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[radius, 0.032 * scale, 10, 32]} />
        <meshStandardMaterial color={colorOption.hex} roughness={roughness} metalness={sheen} />
      </mesh>

      {/* bow: two loops + a knot + two hanging tails */}
      <group position={[0, 0.02, radius + 0.02]} scale={scale}>
        <mesh rotation={[Math.PI / 2, 0, deg(28)]} position={[-0.09, 0, 0]} castShadow>
          <torusGeometry args={[0.09, 0.028, 8, 20, Math.PI * 1.5]} />
          <meshStandardMaterial color={colorOption.hex} roughness={roughness} metalness={sheen} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, -deg(28)]} position={[0.09, 0, 0]} castShadow>
          <torusGeometry args={[0.09, 0.028, 8, 20, Math.PI * 1.5]} />
          <meshStandardMaterial color={colorOption.hex} roughness={roughness} metalness={sheen} side={THREE.DoubleSide} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={colorOption.hex} roughness={roughness} metalness={sheen} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.03, -0.1, -0.01]} rotation={[0, 0, side * deg(12)]}>
            <boxGeometry args={[0.045, 0.16, 0.012]} />
            <meshStandardMaterial color={colorOption.hex} roughness={roughness} metalness={sheen} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function deg(d: number) {
  return (d * Math.PI) / 180
}
