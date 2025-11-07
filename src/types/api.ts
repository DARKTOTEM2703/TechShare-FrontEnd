/**
 * Tipos y utilidades para manejo de respuestas y errores del API.
 * 
 * SINCRONIZADO CON: Back-End-TechShare-Java/src/main/java/com/techmate/techmate/exception/
 * 
 * @module apiTypes
 * @description Define las interfaces y funciones para manejar respuestas del backend
 * de manera tipada y segura.
 * 
 * Última sincronización: 15 de octubre de 2025
 */

/**
 * Estructura de error estándar del backend.
 * 
 * Basado en: ApiErrorResponse.java y GlobalExceptionHandler.java
 */
export interface BackendErrorResponse {
  /** Timestamp del error en formato ISO 8601 */
  timestamp?: string;
  
  /** Código de estado HTTP (400, 401, 403, 404, 500, etc.) */
  status?: number;
  
  /** Descripción corta del error HTTP (Bad Request, Unauthorized, etc.) */
  error?: string;
  
  /** Mensaje principal del error */
  message: string;
  
  /** Ruta del endpoint que generó el error */
  path?: string;
  
  /** Lista de errores de validación (para @Valid BindingResult) */
  errors?: string[];
  
  /** Detalles adicionales del error */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
}

/**
 * Respuesta exitosa genérica del backend.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BackendSuccessResponse<T = any> {
  /** Datos de la respuesta */
  data?: T;
  
  /** Mensaje de éxito (opcional) */
  message?: string;
  
  /** Timestamp de la respuesta */
  timestamp?: string;
}

/**
 * Respuesta de autenticación exitosa.
 */
export interface AuthResponse {
  /** Token JWT */
  token: string;
  
  /** Tipo de token (Bearer) */
  type?: string;
  
  /** Usuario autenticado */
  user?: {
    id: number;
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
  };
  
  /** Tiempo de expiración del token en segundos */
  expiresIn?: number;
}

/**
 * Códigos de error comunes del backend.
 */
export enum BackendErrorCode {
  // Errores de validación (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  
  // Errores de autenticación (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Errores de autorización (403)
  FORBIDDEN = 'FORBIDDEN',
  ACCESS_DENIED = 'ACCESS_DENIED',
  
  // Errores de recursos (404)
  NOT_FOUND = 'NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  
  // Errores de conflicto (409)
  CONFLICT = 'CONFLICT',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  DUPLICATE_USERNAME = 'DUPLICATE_USERNAME',
  
  // Errores de servidor (500)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Extrae el mensaje de error del backend de forma segura.
 * 
 * Maneja múltiples formatos de error y prioriza mensajes de validación.
 * 
 * @param error - Error capturado (puede ser Response, objeto, Error, string, etc.)
 * @returns Mensaje de error legible para mostrar al usuario
 * 
 * @example
 * ```typescript
 * try {
 *   await fetch('/api/register', { ... });
 * } catch (error) {
 *   const message = extractErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function extractErrorMessage(error: unknown): string {
  // Si es una Response de Fetch API
  if (error instanceof Response) {
    return `Error ${error.status}: ${error.statusText}`;
  }
  
  // Si es un objeto (posiblemente BackendErrorResponse)
  if (typeof error === 'object' && error !== null) {
    const backendError = error as Partial<BackendErrorResponse>;
    
    // Prioridad 1: Errores de validación múltiples
    if (backendError.errors && Array.isArray(backendError.errors) && backendError.errors.length > 0) {
      // Si hay múltiples errores, mostrar el primero o combinarlos
      if (backendError.errors.length === 1) {
        return backendError.errors[0];
      }
      return backendError.errors.join('. ');
    }
    
    // Prioridad 2: Mensaje principal
    if (backendError.message) {
      return backendError.message;
    }
    
    // Prioridad 3: Error HTTP genérico
    if (backendError.error) {
      return backendError.error;
    }
  }
  
  // Si es un Error de JavaScript
  if (error instanceof Error) {
    return error.message;
  }
  
  // Si es un string
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback
  return 'Error desconocido. Por favor intente nuevamente.';
}

/**
 * Determina si un error es de validación (400).
 * 
 * @param error - Error a verificar
 * @returns true si es un error de validación
 */
export function isValidationError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const backendError = error as Partial<BackendErrorResponse>;
    return backendError.status === 400 || 
           (backendError.errors && backendError.errors.length > 0) ||
           false;
  }
  return false;
}

/**
 * Determina si un error es de autenticación (401).
 * 
 * @param error - Error a verificar
 * @returns true si es un error de autenticación
 */
export function isAuthenticationError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const backendError = error as Partial<BackendErrorResponse>;
    return backendError.status === 401 || false;
  }
  return false;
}

/**
 * Determina si un error es de conflicto/duplicado (409).
 * 
 * @param error - Error a verificar
 * @returns true si es un error de conflicto
 */
export function isConflictError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const backendError = error as Partial<BackendErrorResponse>;
    return backendError.status === 409 || false;
  }
  return false;
}

/**
 * Extrae todos los mensajes de error de validación.
 * 
 * @param error - Error del backend
 * @returns Array de mensajes de error de validación
 */
export function extractValidationErrors(error: unknown): string[] {
  if (typeof error === 'object' && error !== null) {
    const backendError = error as Partial<BackendErrorResponse>;
    if (backendError.errors && Array.isArray(backendError.errors)) {
      return backendError.errors;
    }
  }
  return [];
}

/**
 * Formatea un error del backend para logging/debugging.
 * 
 * @param error - Error a formatear
 * @returns String formateado con toda la información del error
 */
export function formatErrorForLogging(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const backendError = error as Partial<BackendErrorResponse>;
    return JSON.stringify({
      timestamp: backendError.timestamp || new Date().toISOString(),
      status: backendError.status,
      error: backendError.error,
      message: backendError.message,
      path: backendError.path,
      errors: backendError.errors,
      details: backendError.details,
    }, null, 2);
  }
  
  return String(error);
}
