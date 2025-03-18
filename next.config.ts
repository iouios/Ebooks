/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "img-src 'self' https://lh3.googleusercontent.com https://www.gutenberg.org data:;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
