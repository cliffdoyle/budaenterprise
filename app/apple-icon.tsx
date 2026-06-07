import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#1E3A5F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Orange accent bar at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 30,
            right: 30,
            height: 10,
            borderRadius: 6,
            background: '#F5A623',
          }}
        />
        {/* Bold V */}
        <span
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: -4,
            lineHeight: 1,
            marginBottom: 10,
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size }
  );
}
