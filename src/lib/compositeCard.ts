function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/**
 * Draws the message-card note onto a captured bouquet PNG. The 3D scene is
 * rendered by WebGL, so unlike the old flat DOM canvas there's no live
 * "message card" element inside it to just screenshot — this composites the
 * same little card look on top of the exported frame with plain 2D canvas
 * drawing instead.
 */
export function compositeMessageCard(baseDataUrl: string, message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!message.trim()) {
      resolve(baseDataUrl)
      return
    }
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(baseDataUrl)
        return
      }
      ctx.drawImage(img, 0, 0)

      const cardW = img.width * 0.26
      const padding = cardW * 0.14
      const fontSize = Math.round(cardW * 0.095)
      ctx.font = `${fontSize}px "Prompt", sans-serif`

      const words = message.trim().split(/\s+/)
      const lines: string[] = []
      let line = ''
      const maxWidth = cardW - padding * 2
      for (const w of words) {
        const test = line ? `${line} ${w}` : w
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line)
          line = w
        } else {
          line = test
        }
      }
      if (line) lines.push(line)
      const shownLines = lines.slice(0, 5)

      const lineHeight = fontSize * 1.35
      const cardH = padding * 2.2 + shownLines.length * lineHeight
      const cardX = img.width - cardW - img.width * 0.035
      const cardY = img.height - cardH - img.height * 0.035

      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
      roundRect(ctx, cardX, cardY, cardW, cardH, cardW * 0.07)
      ctx.fill()

      ctx.fillStyle = '#FFD6BC'
      roundRect(ctx, cardX + padding, cardY + padding * 0.7, cardW * 0.24, cardW * 0.035, cardW * 0.02)
      ctx.fill()

      ctx.fillStyle = '#4A3F35'
      ctx.textBaseline = 'top'
      shownLines.forEach((l, i) => {
        ctx.fillText(l, cardX + padding, cardY + padding * 1.5 + i * lineHeight)
      })

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = baseDataUrl
  })
}
