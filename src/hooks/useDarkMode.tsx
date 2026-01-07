'use client';
import { useEffect, useState } from 'react';

export function useDarkMode() {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        // Detectar preferencia del sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Verificar si hay preferencia guardada en localStorage
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            // Usar preferencia del sistema si no hay guardada
            const systemPrefersDark = mediaQuery.matches;
            setIsDark(systemPrefersDark);
            if (systemPrefersDark) {
                document.documentElement.classList.add('dark');
            }
        }

        // Listener para cambios en preferencia del sistema
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setIsDark(e.matches);
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };
        
        mediaQuery.addEventListener('change', handler);
        
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Save theme preference to localStorage (async)
    useEffect(() => {
        if (isDark) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDarkMode = () => {
        const newValue = !isDark;
        setIsDark(newValue);
        
        if (newValue) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return { isDark, toggleDarkMode };
}
