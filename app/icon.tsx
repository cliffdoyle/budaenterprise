import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#1E3A5F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Orange bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: 6,
            right: 6,
            height: 3,
            borderRadius: 2,
            background: '#F5A623',
          }}
        />
        {/* Bold V letter */}
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: -1,
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size }
  );
}
