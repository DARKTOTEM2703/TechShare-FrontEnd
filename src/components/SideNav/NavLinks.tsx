import Link from 'next/link';
import { useState } from 'react';
import links from './navlinks.json';
import * as FaIcons from 'react-icons/fa';

export default function NavLinks() {
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const handleLinkClick = (name: string) => {
    setSelectedLink(name);
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = FaIcons[link.icon as keyof typeof FaIcons];
        const isSelected = selectedLink === link.name;

        return (
          <div key={link.name}>
            <Link
              href={link.href}
              className={`mb-2 flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-secondary md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-300 ease-in-out ${isSelected ? 'bg-secondary text-white transform scale-105' : 'hover:bg-sky-100 hover:text-blue-600'}`}
              onClick={() => handleLinkClick(link.name)}
            >
              {LinkIcon && <LinkIcon />}
              <h2
                className="font-medium text-xl"
                style={{
                  color: isSelected ? '#FFFFFF' : '#1E2A5E',
                  transition: 'color 0.3s, transform 0.3s', // Agregamos transición en el color y en la transformación
                }}
              >
                {link.name}
              </h2>
            </Link>
          </div>
        );
      })}
    </>
  );
}
