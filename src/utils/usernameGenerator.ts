/**
 * Utilidades para generar y validar nombres de usuario.
 * 
 * SINCRONIZADO CON: Back-End-TechShare-Java/src/main/java/com/techmate/techmate/dto/RegisterRequest.java
 * 
 * @module usernameGenerator
 * @description Genera nombres de usuario válidos desde emails que cumplan con las
 * validaciones del backend: @Pattern(regexp = "^[a-zA-Z0-9_-]+$")
 * 
 * Última sincronización: 15 de octubre de 2025
 */

import { VALIDATORS } from './validators';

/**
 * Genera un nombre de usuario válido desde un email.
 * 
 * Reglas aplicadas:
 * - Solo permite caracteres a-zA-Z0-9_-
 * - Longitud entre 3 y 50 caracteres
 * - No puede comenzar con guiones o guión bajo
 * - Reemplaza caracteres inválidos con guión bajo
 * 
 * @param email - Email desde el cual generar el username
 * @returns Username válido que cumple con las reglas del backend
 * @throws Error si el email es inválido
 * 
 * @example
 * ```typescript
 * generateUsername('juan.perez@example.com') // Returns: 'juan_perez'
 * generateUsername('admin+test@company.co')  // Returns: 'admin_test'
 * generateUsername('a@test.com')             // Returns: 'a00' (padding to min 3 chars)
 * ```
 */
export function generateUsername(email: string): string {
  if (!email || !email.includes('@')) {
    throw new Error('Email inválido para generar username');
  }
  
  // Extraer parte antes del @ (local part)
  const localPart = email.split('@')[0];
  
  if (!localPart) {
    throw new Error('Email inválido: parte local vacía');
  }
  
  // Paso 1: Reemplazar caracteres no permitidos con guión bajo
  // Permitidos: a-zA-Z0-9_-
  let username = localPart.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Paso 2: Eliminar guiones/guión bajo al inicio (algunos sistemas no lo permiten)
  username = username.replace(/^[-_]+/, '');
  
  // Paso 3: Eliminar múltiples guiones/guión bajo consecutivos
  username = username.replace(/[-_]{2,}/g, '_');
  
  // Paso 4: Eliminar guiones/guión bajo al final
  username = username.replace(/[-_]+$/, '');
  
  // Paso 5: Si quedó vacío después de limpiar, usar parte del dominio
  if (!username || username.length === 0) {
    const domain = email.split('@')[1].split('.')[0];
    username = domain.replace(/[^a-zA-Z0-9_-]/g, '_');
  }
  
  // Paso 6: Asegurar longitud mínima de 3 caracteres
  if (username.length < VALIDATORS.username.minLength) {
    // Rellenar con números hasta alcanzar longitud mínima
    const padding = '0'.repeat(VALIDATORS.username.minLength - username.length);
    username = username + padding;
  }
  
  // Paso 7: Truncar si excede 50 caracteres
  if (username.length > VALIDATORS.username.maxLength) {
    username = username.substring(0, VALIDATORS.username.maxLength);
  }
  
  // Validación final: asegurar que cumple con el patrón
  if (!isValidUsername(username)) {
    // Fallback: generar username genérico
    const timestamp = Date.now().toString().slice(-6);
    username = `user_${timestamp}`;
  }
  
  return username;
}

/**
 * Valida si un username cumple las reglas del backend.
 * 
 * Reglas:
 * - Solo caracteres a-zA-Z0-9_-
 * - Longitud entre 3 y 50 caracteres
 * 
 * @param username - Nombre de usuario a validar
 * @returns true si el username es válido, false en caso contrario
 * 
 * @example
 * ```typescript
 * isValidUsername('juan_perez')   // Returns: true
 * isValidUsername('ab')           // Returns: false (muy corto)
 * isValidUsername('user@name')    // Returns: false (caracteres inválidos)
 * ```
 */
export function isValidUsername(username: string): boolean {
  if (!username) return false;
  
  // Verificar longitud
  if (
    username.length < VALIDATORS.username.minLength || 
    username.length > VALIDATORS.username.maxLength
  ) {
    return false;
  }
  
  // Verificar patrón
  return VALIDATORS.username.pattern.test(username);
}

/**
 * Sugiere nombres de usuario alternativos si el original ya existe.
 * 
 * @param baseUsername - Username base desde el cual generar alternativas
 * @param count - Número de sugerencias a generar (default: 3)
 * @returns Array de usernames alternativos
 * 
 * @example
 * ```typescript
 * suggestAlternativeUsernames('juan_perez', 3)
 * // Returns: ['juan_perez1', 'juan_perez2', 'juan_perez3']
 * ```
 */
export function suggestAlternativeUsernames(
  baseUsername: string, 
  count: number = 3
): string[] {
  const suggestions: string[] = [];
  
  for (let i = 1; i <= count; i++) {
    let suggestion = `${baseUsername}${i}`;
    
    // Truncar si excede longitud máxima
    if (suggestion.length > VALIDATORS.username.maxLength) {
      const overflow = suggestion.length - VALIDATORS.username.maxLength;
      suggestion = baseUsername.substring(0, baseUsername.length - overflow) + i;
    }
    
    if (isValidUsername(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  return suggestions;
}

/**
 * Normaliza un username para hacerlo válido.
 * Similar a generateUsername pero trabaja sobre un username existente.
 * 
 * @param username - Username a normalizar
 * @returns Username normalizado y válido
 * 
 * @example
 * ```typescript
 * normalizeUsername('Juan Pérez!')  // Returns: 'juan_p_rez'
 * normalizeUsername('--admin--')    // Returns: 'admin'
 * ```
 */
export function normalizeUsername(username: string): string {
  if (!username) {
    return generateUsername('user@default.com');
  }
  
  // Convertir a minúsculas
  let normalized = username.toLowerCase();
  
  // Reemplazar caracteres no permitidos
  normalized = normalized.replace(/[^a-z0-9_-]/g, '_');
  
  // Eliminar guiones/guión bajo al inicio y final
  normalized = normalized.replace(/^[-_]+/, '').replace(/[-_]+$/, '');
  
  // Eliminar múltiples guiones/guión bajo consecutivos
  normalized = normalized.replace(/[-_]{2,}/g, '_');
  
  // Asegurar longitud mínima
  if (normalized.length < VALIDATORS.username.minLength) {
    normalized = normalized.padEnd(VALIDATORS.username.minLength, '0');
  }
  
  // Truncar si excede longitud máxima
  if (normalized.length > VALIDATORS.username.maxLength) {
    normalized = normalized.substring(0, VALIDATORS.username.maxLength);
  }
  
  return normalized;
}
