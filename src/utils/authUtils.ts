/**
 * Utilidades de autenticación
 * Funciones para extraer información del JWT y verificar permisos
 */

import { getToken } from '@/services/storageService';

/**
 * Decodifica el payload de un JWT sin validar la firma
 * @param token - Token JWT
 * @returns El payload decodificado o null si hay error
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    
    let payload = parts[1];
    const pad = (4 - (payload.length % 4)) % 4;
    payload += '='.repeat(pad);
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    const bytes = atob(payload);
    
    // Intentar decodificar como UTF-8
    try {
      const arr = Array.prototype.map.call(bytes, function(c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('');
      const json = decodeURIComponent(arr);
      return JSON.parse(json);
    } catch {
      // Fallback: parse directo
      return JSON.parse(bytes);
    }
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Obtiene los roles del usuario desde el JWT
 * @returns Array de roles (ej: ['ROLE_USER', 'ROLE_ADMIN']) o []
 */
export function getUserRoles(): string[] {
  const token = getToken();
  if (!token) return [];
  
  const payload = decodeJWT(token);
  if (!payload) return [];
  
  // Los roles pueden venir en diferentes campos según el backend
  return payload.roles || payload.authorities || [];
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param role - Rol a verificar (ej: 'ADMIN' o 'ROLE_ADMIN')
 * @returns true si el usuario tiene el rol
 */
export function hasRole(role: string): boolean {
  const roles = getUserRoles();
  
  // Normalizar el rol buscado (agregar ROLE_ si no lo tiene)
  const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  
  // Verificar ambas variantes
  return roles.includes(normalizedRole) || roles.includes(role);
}

/**
 * Verifica si el usuario es administrador
 * @returns true si el usuario tiene rol ADMIN
 */
export function isAdmin(): boolean {
  return hasRole('ADMIN');
}

/**
 * Verifica si el usuario está autenticado
 * @returns true si hay un token válido
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  const payload = decodeJWT(token);
  if (!payload) return false;
  
  // Verificar si el token no ha expirado
  if (payload.exp) {
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }
  
  return true;
}
