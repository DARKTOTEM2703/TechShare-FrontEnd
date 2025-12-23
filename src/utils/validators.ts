/**
 * Validadores centralizados que coinciden con el backend.
 * 
 * SINCRONIZADO CON: Back-End-TechShare-Java/src/main/java/com/techmate/techmate/dto/RegisterRequest.java
 * 
 * @module validators
 * @description Validaciones client-side que replican las validaciones del backend.
 * Estas validaciones mejoran la UX pero NO reemplazan las validaciones del servidor.
 * 
 * Última sincronización: 15 de octubre de 2025
 */

/**
 * Configuración de validadores para cada campo del formulario de registro.
 */
export const VALIDATORS = {
  /**
   * Username: solo letras, números, guiones y guión bajo
   * Backend: @Pattern(regexp = "^[a-zA-Z0-9_-]+$")
   */
  username: {
    pattern: /^[a-zA-Z0-9_-]+$/,
    minLength: 3,
    maxLength: 50,
    message: 'Usuario solo puede contener letras, números, guiones (-) y guión bajo (_)'
  },
  
  /**
   * Nombre/Apellido: letras con acentos, espacios, apóstrofes y guiones
   * Backend: @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s'-]+$")
   */
  name: {
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/,
    minLength: 2,
    maxLength: 100,
    message: 'Nombre contiene caracteres inválidos. Solo se permiten letras, espacios, apóstrofes y guiones'
  },
  
  /**
   * Email según RFC 5322 simplificado
   * Backend: @Email(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
   */
  email: {
    pattern: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    maxLength: 255,
    message: 'Email inválido. Formato esperado: usuario@dominio.com'
  },
  
  /**
   * Password: mínimo 8 chars, mayúscula, minúscula, número, carácter especial
   * Backend: @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-#.,:;])[A-Za-z\\d@$!%*?&_\\-#.,:;]{8,}$")
   */
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#.,:;])[A-Za-z\d@$!%*?&_\-#.,:;]{8,}$/,
    minLength: 8,
    maxLength: 128,
    message: 'La contraseña debe tener mínimo 8 caracteres e incluir: mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&_-#.,:;)'
  }
} as const;

/**
 * Resultado de una validación.
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Valida un campo según las reglas definidas.
 * 
 * @param value - Valor a validar
 * @param validator - Configuración del validador a usar
 * @param fieldName - Nombre del campo (para mensajes personalizados)
 * @returns Resultado de la validación con mensaje de error si aplica
 * 
 * @example
 * ```typescript
 * const result = validateField('test@example.com', VALIDATORS.email, 'Email');
 * if (!result.valid) {
 *   console.error(result.message);
 * }
 * ```
 */
export function validateField(
  value: string, 
  validator: typeof VALIDATORS[keyof typeof VALIDATORS],
  fieldName: string = 'Campo'
): ValidationResult {
  // Verificar si el campo está vacío
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} es obligatorio` };
  }
  
  const trimmed = value.trim();
  
  // Validar longitud mínima (si está definida)
  if ('minLength' in validator && validator.minLength && trimmed.length < validator.minLength) {
    return { 
      valid: false, 
      message: `${fieldName} debe tener mínimo ${validator.minLength} caracteres` 
    };
  }
  
  // Validar longitud máxima (si está definida)
  if ('maxLength' in validator && validator.maxLength && trimmed.length > validator.maxLength) {
    return { 
      valid: false, 
      message: `${fieldName} debe tener máximo ${validator.maxLength} caracteres` 
    };
  }
  
  // Validar patrón regex
  if (!validator.pattern.test(trimmed)) {
    return { valid: false, message: validator.message };
  }
  
  return { valid: true };
}

/**
 * Valida todos los campos de un formulario de registro.
 * 
 * @param formData - Datos del formulario a validar
 * @returns Resultado de la validación con mensaje de error si aplica
 * 
 * @example
 * ```typescript
 * const result = validateRegistrationForm({
 *   first_name: 'Juan',
 *   last_name: 'Pérez',
 *   email: 'juan@example.com',
 *   password: 'Secure123!',
 *   confirmPassword: 'Secure123!'
 * });
 * ```
 */
export function validateRegistrationForm(formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  // Validar nombre
  const firstNameValidation = validateField(formData.firstName, VALIDATORS.name, 'Nombre');
  if (!firstNameValidation.valid) {
    return firstNameValidation;
  }
  
  // Validar apellido
  const lastNameValidation = validateField(formData.lastName, VALIDATORS.name, 'Apellido');
  if (!lastNameValidation.valid) {
    return lastNameValidation;
  }
  
  // Validar email
  const emailValidation = validateField(formData.email, VALIDATORS.email, 'Email');
  if (!emailValidation.valid) {
    return emailValidation;
  }
  
  // Validar contraseña
  const passwordValidation = validateField(formData.password, VALIDATORS.password, 'Contraseña');
  if (!passwordValidation.valid) {
    return passwordValidation;
  }
  
  // Validar que las contraseñas coincidan
  if (formData.password !== formData.confirmPassword) {
    return { valid: false, message: 'Las contraseñas no coinciden' };
  }
  
  return { valid: true };
}

/**
 * Valida una fecha de nacimiento.
 * 
 * @param day - Día del mes (1-31)
 * @param month - Mes (1-12)
 * @param year - Año
 * @returns Resultado de la validación con mensaje de error si aplica
 */
export function validateBirthDate(
  day: string, 
  month: string, 
  year: string
): ValidationResult {
  // Si todos están vacíos, es válido (campo opcional)
  if (!day && !month && !year) {
    return { valid: true };
  }
  
  // Si alguno está vacío pero otros no, es inválido
  if (!day || !month || !year) {
    return { 
      valid: false, 
      message: 'Debe completar día, mes y año de nacimiento' 
    };
  }
  
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  // Validar rangos básicos
  if (dayNum < 1 || dayNum > 31) {
    return { valid: false, message: 'Día inválido' };
  }
  
  if (monthNum < 1 || monthNum > 12) {
    return { valid: false, message: 'Mes inválido' };
  }
  
  const currentYear = new Date().getFullYear();
  if (yearNum < 1900 || yearNum > currentYear) {
    return { valid: false, message: 'Año inválido' };
  }
  
  // Validar que la fecha sea válida
  const date = new Date(yearNum, monthNum - 1, dayNum);
  if (
    date.getDate() !== dayNum ||
    date.getMonth() !== monthNum - 1 ||
    date.getFullYear() !== yearNum
  ) {
    return { valid: false, message: 'Fecha inválida' };
  }
  
  // Validar que la fecha sea en el pasado (Backend: @Past)
  if (date >= new Date()) {
    return { valid: false, message: 'La fecha de nacimiento debe ser en el pasado' };
  }
  
  return { valid: true };
}
