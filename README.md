# TechShare FrontEnd

Frontend for the **inventory and loan management** platform developed for the **Robotics Division of the AAAIMX organization**. This application enables efficient management of resources and equipment, facilitating control and streamlining the loan process.

## Description

**TechShare** is a platform designed for efficient inventory and loan management. Its primary goal is to provide the AAAIMX Robotics Division with an intuitive and functional system to organize and track their equipment and materials. This repository contains the frontend of the application, developed with **Next.js** and styled with **Tailwind CSS**, providing a fast and responsive user experience.

## Project Status

🚧 **Currently in Development**: This project is actively under development. Some features may not be fully implemented, and the application might contain placeholders or temporary components as it progresses towards a stable release.

## Technologies

- **Next.js** - React framework for high-performance web applications and static/dynamic content generation.
- **Tailwind CSS** - Utility-first CSS framework that allows efficient creation of custom designs.
- **TypeScript** - Enhances safety and productivity in development.
- **Vercel** - Continuous deployment platform for Next.js applications.

## Features

- **Equipment Inventory**: Allows viewing, adding, updating, and deleting inventory items.
- **Loan Management**: Facilitates the process of lending and returning equipment.
- **Status Reports**: Provides reports on equipment status and availability.
- **Responsive Interface**: Optimized for different devices and screen sizes.

## Development Environment Setup

To configure and run the project locally, follow these steps:

1. Clone the repository and navigate to the project directory.
   ```bash
   git clone <repository-url>
   cd TechShare-FrontEnd
   ```
2. Install the required dependencies with your preferred package manager.
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env.local` file in the project root to define the necessary environment variables. Refer to the documentation or the development team for specific configuration details.
   ```bash
   touch .env.local
   ```
4. Start the development server and access the application in your browser at `http://localhost:3000`.
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Deployment

This project is configured to deploy on **Vercel**. Once the code is pushed to the repository, Vercel automatically handles the production deployment.

For more deployment details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributions

Contributions are welcome. If you want to collaborate on the project, you can open an **issue** to report problems or suggest improvements, or submit a **pull request** with your changes.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## License

This project is licensed under the [MIT License](./LICENSE).

## Análisis de Arquitectura

Para un análisis completo y detallado de la arquitectura del proyecto (tanto Frontend como Backend), consulta el documento:

📖 **[ANALISIS_ARQUITECTURA.md](./ANALISIS_ARQUITECTURA.md)**

Este documento incluye:
- Estructura completa del Frontend (Next.js)
- Arquitectura del Backend (Spring Boot)
- Explicación detallada de CONFIG, DTO, ENTITY, Repository, Security, Service, impl, User, Validation
- Flujos de autenticación y operaciones CRUD
- Diagramas de arquitectura completos
- Integración Frontend-Backend

---

This README provides an initial guide to understand and contribute to **TechShare FrontEnd**. Thank you for your interest in improving inventory management for AAAIMX!
