import * as THREE from 'three'

const EXTRUDE = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments: 8 }

/**
 * A rounded petal tapering to a point, attached at the local origin and
 * pointing toward +Y — the single workhorse shape behind most flowers here
 * (rose, daisy, lily, sakura, marigold...). `notch` carves a small dip at the
 * tip for shapes like cherry blossom.
 */
export function teardropPetalGeometry(length = 1, width = 0.4, notch = 0) {
  const hw = width / 2
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(-hw, length * 0.16, -hw * 1.05, length * 0.58, -hw * 0.4, length * (0.92 - notch))
  if (notch > 0) {
    shape.quadraticCurveTo(-hw * 0.16, length * (1 - notch * 0.5), 0, length * (0.86 - notch * 0.6))
    shape.quadraticCurveTo(hw * 0.16, length * (1 - notch * 0.5), hw * 0.4, length * (0.92 - notch))
  } else {
    shape.quadraticCurveTo(0, length * 1.06, hw * 0.4, length * 0.92)
  }
  shape.bezierCurveTo(hw * 1.05, length * 0.58, hw, length * 0.16, 0, 0)
  return new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth: length * 0.09 })
}

/** A wide, short, rounded petal — the orchid's oversized lip. */
export function lipPetalGeometry(length = 0.5, width = 0.85) {
  const hw = width / 2
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(-hw * 1.1, length * 0.25, -hw, length * 0.85, -hw * 0.5, length * 0.98)
  shape.bezierCurveTo(-hw * 0.22, length * 1.12, hw * 0.22, length * 1.12, hw * 0.5, length * 0.98)
  shape.bezierCurveTo(hw, length * 0.85, hw * 1.1, length * 0.25, 0, 0)
  return new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth: length * 0.1 })
}

/** A jagged, fringe-tipped petal — the carnation's ruffled edge. */
export function fringedPetalGeometry(length = 0.55, width = 0.42, teeth = 6) {
  const hw = width / 2
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(-hw, length * 0.48)
  const topBase = length * 0.55
  for (let i = 0; i <= teeth; i++) {
    const x = -hw + (i / teeth) * width
    const y = i % 2 === 0 ? topBase : length
    shape.lineTo(x, y)
  }
  shape.lineTo(hw, length * 0.48)
  shape.closePath()
  return new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth: length * 0.07, bevelSize: 0.008, bevelThickness: 0.008 })
}

/** A small flat leaf, used for the eucalyptus branch. */
export function leafGeometry(length = 0.3, width = 0.16) {
  return teardropPetalGeometry(length, width, 0)
}

