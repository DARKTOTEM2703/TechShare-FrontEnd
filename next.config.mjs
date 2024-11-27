/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Agregamos la configuración para SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'], // Usamos @svgr/webpack para importar SVGs como componentes React
    });

    return config;
  },
};

export default nextConfig;
