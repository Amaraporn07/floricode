interface MessageCardProps {
  message: string
}

export default function MessageCard({ message }: MessageCardProps) {
  if (!message.trim()) return null

  return (
    <div className="absolute bottom-3 right-3 w-28 rounded-lg bg-white/95 p-2 text-center shadow-card">
      <div className="mx-auto mb-1 h-1 w-6 rounded-full bg-peach-200" />
      <p className="line-clamp-4 font-body text-[10px] leading-snug text-ink/80">{message}</p>
    </div>
  )
}
