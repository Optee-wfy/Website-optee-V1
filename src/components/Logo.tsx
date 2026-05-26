export default function Logo({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  const spanWidth = size * 0.5;
  const borderColor = dark ? '#1e3a7f' : '#666';

  return (
    <div
      className="relative rounded-full flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        boxShadow: dark ? '4px 4px 12px rgba(0,0,0,0.15)' : '4px 4px 12px rgba(0,0,0,0.55)',
        border: `1px solid ${borderColor}`,
        background: dark ? '#0b1d4e' : 'transparent',
      }}
    >
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: spanWidth,
          height: size,
          transformOrigin: 'top left',
          animation: 'radar-spin 2s linear infinite',
          borderTop: `1px dashed ${dark ? '#4d66a3' : '#fff'}`,
          background: 'transparent',
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'white',
            transformOrigin: 'top left',
            transform: 'rotate(-55deg)',
            filter: 'blur(10px) drop-shadow(6px 6px 6px white)',
          }}
        />
      </div>
    </div>
  );
}
