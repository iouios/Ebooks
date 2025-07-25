/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['tysasgfmndcgptbtmzgq.supabase.co']
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "img-src 'self' blob: data: https://lh3.googleusercontent.com https://www.gutenberg.org https://tysasgfmndcgptbtmzgq.supabase.co;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
