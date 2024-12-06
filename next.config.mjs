/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // Agrega 'localhost' para permitir imágenes desde este dominio
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la construcción
  },
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
