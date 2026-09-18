/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    NEXT_PUBLIC_PUSHER_CLUSTER:
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? process.env.cluster,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
