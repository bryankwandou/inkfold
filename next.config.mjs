/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Reader pages ship zero third-party JavaScript. These headers are the
  // enforcement, not a promise in the marketing copy.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              // Only the two provenance-checked content origins may serve images.
              "img-src 'self' data: https://peppercarrot.com https://iiif.archive.org",
              "font-src 'self' data:",
              "connect-src 'self' https://peppercarrot.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
