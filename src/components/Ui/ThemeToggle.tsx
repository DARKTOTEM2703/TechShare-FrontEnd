'use client';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function ThemeToggle() {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="
                p-2 rounded-lg 
                bg-gray-200 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                hover:bg-gray-300 dark:hover:bg-gray-600
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                shadow-sm hover:shadow-md
            "
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            {isDark ? (
                <FaSun className="w-5 h-5" />
            ) : (
                <FaMoon className="w-5 h-5" />
            )}
        </button>
    );
}
