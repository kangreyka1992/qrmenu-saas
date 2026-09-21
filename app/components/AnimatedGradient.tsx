'use client'

export default function AnimatedGradient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30 animate-[gradientMove_20s_linear_infinite]"
        style={{
          background: `conic-gradient(
            from 0deg,
            rgba(255, 155, 38, 0.15),
            rgba(124, 92, 255, 0.15),
            rgba(61, 214, 140, 0.15),
            rgba(255, 155, 38, 0.15)
          )`,
        }}
      />
    </div>
  )
}