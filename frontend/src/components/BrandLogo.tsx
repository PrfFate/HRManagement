type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`} aria-label="Pratech">
      <span>pra</span>
      <span className="logo-check">✓</span>
      <span>tech</span>
    </div>
  );
}
