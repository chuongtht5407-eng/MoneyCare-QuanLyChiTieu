import React from 'react';

export type ViBeVariant = 'hero' | 'banner' | 'compact';

interface ViBeMascotProps {
  variant?: ViBeVariant;
  className?: string;
}

export const VIBE_QUOTES: readonly string[] = [
  'Cùng Ví Bé rèn kỹ năng quản lý tiền bạc nhé! 💙',
  'Ví chưa giàu nhưng kiến thức đang tăng!',
  'Lương chưa về mà Shopee đã gọi rồi!',
  'Tiết kiệm được 50k, Ví Bé xin tuyên dương!',
  'Chi tiêu có kế hoạch, cuối tháng khỏi ăn mì gói!',
];

export const VIBE_COMPLETED_QUOTES: readonly string[] = [
  'Tuyệt vời! Hôm nay ví của bạn đã an toàn hơn một bậc! 🎉',
  'Giữ chuỗi học thật đỉnh, Ví Bé tự hào về bạn lắm!',
  'Kiến thức đã nạp đầy, ví tiền cũng tự tin hơn hẳn!',
];

export function getInitialViBeQuoteIndex(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % VIBE_QUOTES.length;
  }
  return Math.abs(hash) % VIBE_QUOTES.length;
}

export const ViBeMascot: React.FC<ViBeMascotProps> = ({
  variant = 'hero',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <svg
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className || 'w-11 h-11 shrink-0'}
        role="img"
        aria-label="Linh vật Ví Bé"
      >
        {/* Graduation Cap */}
        <path d="M14 23L36 13L58 23L36 33L14 23Z" fill="#1E3A8A" />
        <path d="M23 27.5V34C23 36.2 28.8 38 36 38C43.2 38 49 36.2 49 34V27.5" fill="#1D4ED8" />
        <path d="M54 24.5V34" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="54" cy="35.5" r="2.5" fill="#FACC15" />

        {/* Wallet Body */}
        <rect x="13" y="29" width="44" height="33" rx="11" fill="#2F5BEA" />
        <rect x="15" y="31" width="40" height="29" rx="9.5" fill="#4C82FB" />
        <path d="M18 33C25 30 39 30 49 33" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

        {/* Wallet Clasp */}
        <rect x="49" y="41" width="11" height="10" rx="5" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.5" />
        <circle cx="54.5" cy="46" r="2.2" fill="#FDE047" />

        {/* Friendly Face */}
        <circle cx="27.5" cy="44" r="3" fill="#0F172A" />
        <circle cx="28.4" cy="43" r="1" fill="#FFFFFF" />
        <circle cx="40.5" cy="44" r="3" fill="#0F172A" />
        <circle cx="41.4" cy="43" r="1" fill="#FFFFFF" />
        <ellipse cx="23" cy="48.5" rx="2.6" ry="1.5" fill="#FDA4AF" opacity="0.85" />
        <ellipse cx="45" cy="48.5" rx="2.6" ry="1.5" fill="#FDA4AF" opacity="0.85" />
        <path d="M30.5 49.5C32.2 52 35.8 52 37.5 49.5" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === 'banner') {
    return (
      <svg
        viewBox="0 0 112 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className || 'w-24 h-22 shrink-0'}
        role="img"
        aria-label="Linh vật Ví Bé cùng đồng xu vàng"
      >
        {/* Soft glow & sparkles */}
        <circle cx="20" cy="24" r="2.5" fill="#FDE047" />
        <path d="M97 22L98.8 26.2L103 28L98.8 29.8L97 34L95.2 29.8L91 28L95.2 26.2L97 22Z" fill="#FEF08A" />
        <circle cx="15" cy="68" r="2" fill="#BFDBFE" opacity="0.8" />

        {/* Gold Coin Behind Left */}
        <circle cx="29" cy="48" r="13" fill="#F59E0B" />
        <circle cx="29" cy="48" r="10" fill="#FACC15" />
        <text
          x="29"
          y="52.5"
          textAnchor="middle"
          fill="#B45309"
          fontSize="13"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          ₫
        </text>

        {/* Ground shadow */}
        <ellipse cx="64" cy="92" rx="30" ry="6" fill="#1E3A8A" opacity="0.28" />

        {/* Little feet */}
        <rect x="46" y="81" width="10" height="9" rx="5" fill="#1E40AF" />
        <rect x="70" y="81" width="10" height="9" rx="5" fill="#1E40AF" />

        {/* Waving little arms */}
        <path d="M35 61C29 58 26 53 27 48" stroke="#1E40AF" strokeWidth="5" strokeLinecap="round" />
        <path d="M90 61C96 58 99 54 98 49" stroke="#1E40AF" strokeWidth="5" strokeLinecap="round" />

        {/* Wallet Body */}
        <rect x="34" y="38" width="58" height="46" rx="14" fill="#1D4ED8" />
        <rect x="37" y="40" width="52" height="42" rx="12" fill="#60A5FA" />
        <rect x="39" y="43" width="48" height="36" rx="10" fill="#3B82F6" />
        <path d="M44 45C54 42 70 42 82 45" stroke="#BFDBFE" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* Wallet Clasp */}
        <rect x="82" y="55" width="14" height="12" rx="6" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />
        <circle cx="89" cy="61" r="2.6" fill="#FDE047" />

        {/* Graduation Cap */}
        <path d="M37 31L63 19L89 31L63 43L37 31Z" fill="#1E3A8A" />
        <path d="M47 35.5V43C47 45.8 54.2 48 63 48C71.8 48 79 45.8 79 43V35.5" fill="#1E40AF" />
        <path d="M84 32.5V44" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="84" cy="46" r="3" fill="#FACC15" />

        {/* Friendly Face */}
        <circle cx="53" cy="59" r="3.6" fill="#0F172A" />
        <circle cx="54.2" cy="57.7" r="1.3" fill="#FFFFFF" />
        <circle cx="71" cy="59" r="3.6" fill="#0F172A" />
        <circle cx="72.2" cy="57.7" r="1.3" fill="#FFFFFF" />
        <ellipse cx="47.5" cy="64.5" rx="3.4" ry="2" fill="#FDA4AF" opacity="0.85" />
        <ellipse cx="76.5" cy="64.5" rx="3.4" ry="2" fill="#FDA4AF" opacity="0.85" />
        <path d="M56.5 65.5C59 69 65 69 67.5 65.5" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }

  // Default: 'hero' variant (matches Screen 1 with Ví Bé + graduation cap + stacked books + sparkles)
  return (
    <svg
      viewBox="0 0 120 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || 'w-24 h-22 shrink-0'}
      role="img"
      aria-label="Linh vật Ví Bé đội mũ tốt nghiệp"
    >
      {/* Background soft aura */}
      <circle cx="56" cy="58" r="40" fill="#EAF0FF" />

      {/* Sparkles */}
      <path d="M16 26L18.2 31.2L23.5 33.5L18.2 35.8L16 41L13.8 35.8L8.5 33.5L13.8 31.2L16 26Z" fill="#FACC15" />
      <circle cx="96" cy="24" r="3" fill="#60A5FA" />
      <circle cx="104" cy="36" r="2" fill="#FACC15" />

      {/* Ground shadow */}
      <ellipse cx="60" cy="95" rx="40" ry="6" fill="#CBD5E1" opacity="0.55" />

      {/* Stacked Books on Right */}
      <rect x="74" y="79" width="32" height="11" rx="3" fill="#2563EB" />
      <rect x="77" y="81.5" width="24" height="6" rx="1.5" fill="#EFF6FF" />
      <rect x="77" y="69" width="28" height="10" rx="3" fill="#FB923C" />
      <rect x="80" y="71.5" width="20" height="5" rx="1.5" fill="#FFF7ED" />

      {/* Little feet */}
      <rect x="35" y="83" width="10" height="10" rx="5" fill="#1E40AF" />
      <rect x="57" y="83" width="10" height="10" rx="5" fill="#1E40AF" />

      {/* Waving left arm */}
      <path d="M24 62C17 58 14 53 16 47" stroke="#1E40AF" strokeWidth="5" strokeLinecap="round" />
      {/* Right arm resting near books */}
      <path d="M78 65C82 65 85 67 86 70" stroke="#1E40AF" strokeWidth="5" strokeLinecap="round" />

      {/* Wallet Body */}
      <rect x="23" y="38" width="57" height="47" rx="14" fill="#1D4ED8" />
      <rect x="25.5" y="40.5" width="52" height="42" rx="12" fill="#60A5FA" />
      <rect x="28" y="43" width="47" height="37" rx="10" fill="#2F5BEA" />
      <path d="M33 46C43 43 58 43 69 46" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* Wallet Clasp */}
      <rect x="71" y="56" width="13" height="12" rx="6" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />
      <circle cx="77.5" cy="62" r="2.5" fill="#FDE047" />

      {/* Graduation Cap */}
      <path d="M25 30L51.5 17L78 30L51.5 43L25 30Z" fill="#1E3A8A" />
      <path d="M35.5 34.5V42.5C35.5 45.2 42.7 47.5 51.5 47.5C60.3 47.5 67.5 45.2 67.5 42.5V34.5" fill="#1D4ED8" />
      <path d="M73 31.5V43.5" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="73" cy="45.5" r="3" fill="#FACC15" />

      {/* Friendly Face */}
      <circle cx="42.5" cy="60" r="3.6" fill="#0F172A" />
      <circle cx="43.7" cy="58.7" r="1.3" fill="#FFFFFF" />
      <circle cx="59.5" cy="60" r="3.6" fill="#0F172A" />
      <circle cx="60.7" cy="58.7" r="1.3" fill="#FFFFFF" />
      <ellipse cx="37" cy="65.5" rx="3.4" ry="2" fill="#FDA4AF" opacity="0.9" />
      <ellipse cx="65" cy="65.5" rx="3.4" ry="2" fill="#FDA4AF" opacity="0.9" />
      <path d="M46 66.5C48.5 70 53.5 70 56 66.5" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
};
