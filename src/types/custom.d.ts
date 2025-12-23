// Declaraciones globales para assets estáticos (SVG, imágenes)
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';

// Aceptar imports con rutas absolutas que usan /src/... en algunos componentes
declare module '/src/*';

// También aceptar imports con alias @
declare module '@/*';
declare module '@/*/*.svg';
declare module '@/assets/*';
declare module '@/assets/*/*.svg';

export {};
