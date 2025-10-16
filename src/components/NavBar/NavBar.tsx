"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import links from "./navlinks.json";
import Image from "next/image";

export default function NavBar() {
  return (
    <div className="bg-white shadow-md shadow-black/20 rounded-lg">
      <div className="mx-auto flex justify-between items-center py-3 px-4">
        <div className="flex items-center">
          <div className="bg-secondary rounded-md">
            <Image
              src="/AAAIMX-logo.svg" // Cambia esta ruta por la imagen de tu logo
              alt="Logo"
              width={48}
              height={48}
              priority
            />
          </div>
        </div>

        {/* Links */}
        <div className="flex justify-start space-x-8">
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              <h2 className="text-primary text-lg font-semibold hover:text-secondary transition">
                {link.name.toUpperCase()}
              </h2>
            </Link>
          ))}
        </div>

        {/* Botón de Iniciar Sesión */}
        <div className="flex items-center space-x-4">
          {/* Icono del carrito (placeholder por ahora) */}
          <div className="text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7a1 1 0 001.76 1.1M21 16H7m7 5a2 2 0 11-4 0m4 0a2 2 0 11-4 0"
              />
            </svg>
          </div>

          {/* Botón de Login */}
          <Link href="/login" target="_blank" rel="noopener noreferrer">
            <h2 className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
              Iniciar Sesión
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
