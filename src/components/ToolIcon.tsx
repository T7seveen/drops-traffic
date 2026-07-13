interface ToolIconProps {
  type: 'bars' | 'target' | 'radar' | 'grid' | 'layers' | 'trend'
  color: string
  size?: 'default' | 'large'
}

export function ToolIcon({ type, color, size = 'default' }: ToolIconProps) {
  const s = size === 'large' ? 52 : 40

  const icons: Record<string, React.ReactNode> = {
    bars: (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: s * 0.6 }}>
        <div style={{ width: s * 0.15, height: '40%', background: color, borderRadius: 2 }} />
        <div style={{ width: s * 0.15, height: '70%', background: color, borderRadius: 2 }} />
        <div style={{ width: s * 0.15, height: '55%', background: color, borderRadius: 2 }} />
        <div style={{ width: s * 0.15, height: '100%', background: color, borderRadius: 2 }} />
      </div>
    ),
    target: (
      <div style={{ position: 'relative', width: s * 0.65, height: s * 0.65 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${color}` }} />
        <div style={{ position: 'absolute', inset: '25%', borderRadius: '50%', border: `2px solid ${color}` }} />
        <div style={{ position: 'absolute', inset: '42%', borderRadius: '50%', background: color }} />
      </div>
    ),
    radar: (
      <div style={{ position: 'relative', width: s * 0.65, height: s * 0.65 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${color}`, opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: '18%', borderRadius: '50%', border: `2px solid ${color}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', inset: '36%', borderRadius: '50%', border: `2px solid ${color}` }} />
      </div>
    ),
    grid: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, width: s * 0.6, height: s * 0.6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ borderRadius: 3, background: i === 3 ? color : color + '80' }} />
        ))}
      </div>
    ),
    layers: (
      <div style={{ position: 'relative', width: s * 0.65, height: s * 0.55 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            left: i * 4, top: i * 5,
            right: 0, bottom: 0,
            borderRadius: 4,
            border: `2px solid ${color}`,
            opacity: 1 - i * 0.25,
            background: i === 0 ? `${color}15` : 'transparent',
          }} />
        ))}
      </div>
    ),
    trend: (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: s * 0.6 }}>
        {[30, 50, 45, 70, 85, 100].map((h, i) => (
          <div key={i} style={{ width: s * 0.1, height: `${h}%`, background: color, borderRadius: 2, opacity: 0.4 + i * 0.12 }} />
        ))}
      </div>
    ),
  }

  return (
    <div style={{ width: s, height: s, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icons[type]}
    </div>
  )
}
