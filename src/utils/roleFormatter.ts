/**
 * Utilidades para formatear nombres de roles
 */

/**
 * Limpia el prefijo "ROLE_" de un nombre de rol
 * Ejemplo: "ROLE_ADMIN" -> "ADMIN", "ROLE_USER" -> "USER"
 * 
 * @param role - El nombre del rol con o sin prefijo
 * @returns El nombre del rol sin el prefijo "ROLE_"
 */
export function cleanRoleName(role: string): string {
    return role.replace(/^ROLE_/, '');
}

/**
 * Limpia el prefijo "ROLE_" de un array de roles
 * 
 * @param roles - Array de nombres de roles
 * @returns Array de nombres de roles sin el prefijo "ROLE_"
 */
export function cleanRoleNames(roles: string[]): string[] {
    return roles.map(role => cleanRoleName(role));
}

/**
 * Formatea un rol para mostrarlo de manera amigable
 * Ejemplo: "ROLE_ADMIN" -> "Admin", "ROLE_USER" -> "User"
 * 
 * @param role - El nombre del rol
 * @returns El nombre del rol formateado con primera letra mayúscula
 */
export function formatRoleName(role: string): string {
    const cleaned = cleanRoleName(role);
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}
