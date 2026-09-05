export default function Logo({ size = 40, fontSize = 16, dark = false }) {
  return (
    <div
      className="app-logo"
      style={{
        width: size,
        height: size,
        fontSize: fontSize,
        background: dark
          ? 'linear-gradient(145deg, #4f46e5, #4338ca)'
          : 'linear-gradient(145deg, #4f46e5, #7c3aed)',
      }}
    >
      @R
    </div>
  );
}