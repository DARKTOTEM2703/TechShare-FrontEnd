/**
 * Constantes de validación compartidas entre componentes
 * Mantiene consistencia con las validaciones del backend
 */

export const VALIDATION_PATTERNS = {
  /**
   * Password: Mínimo 8 caracteres, al menos:
   * - Una mayúscula
   * - Una minúscula
   * - Un número
   * - Un carácter especial (@$!%*?&_-#.,:;)
   */
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#.,:;])[A-Za-z\d@$!%*?&_\-#.,:;]{8,}$/,
  
  /**
   * Email: Formato estándar RFC compliant
   */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /**
   * Email completo (más restrictivo, igual al backend)
   */
  emailStrict: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  
  /**
   * Nombres: Letras, espacios, apóstrofes, guiones
   * Incluye caracteres latinos (áéíóúñü)
   */
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/,
  
  /**
   * Username: Solo letras, números, guiones y guiones bajos
   */
  username: /^[a-zA-Z0-9_-]+$/,
};

export const VALIDATION_MESSAGES = {
  password: "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&_-#.,:;)",
  email: "Email inválido",
  name: "El nombre contiene caracteres inválidos",
  username: "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos",
  required: "Este campo es obligatorio",
  passwordMismatch: "Las contraseñas no coinciden",
  invalidDate: "Fecha de nacimiento inválida",
  pastDate: "La fecha de nacimiento debe ser en el pasado",
  minAge: "Debes tener al menos 13 años para registrarte",
  invalidDay: "Fecha de nacimiento inválida (día no válido para ese mes)",
};

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
  },
  email: {
    maxLength: 255,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  username: {
    minLength: 3,
    maxLength: 50,
  },
  age: {
    minimum: 13,
  },
};

/**
 * Valida una contraseña
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password) {
    return { isValid: false, message: VALIDATION_MESSAGES.required };
  }
  
  if (password.length < VALIDATION_RULES.password.minLength) {
    return { isValid: false, message: `La contraseña debe tener al menos ${VALIDATION_RULES.password.minLength} caracteres` };
  }
  
  if (!VALIDATION_PATTERNS.password.test(password)) {
    return { isValid: false, message: VALIDATION_MESSAGES.password };
  }
  
  return { isValid: true };
}

/**
 * Valida un email
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: VALIDATION_MESSAGES.required };
  }
  
  if (!VALIDATION_PATTERNS.email.test(email)) {
    return { isValid: false, message: VALIDATION_MESSAGES.email };
  }
  
  return { isValid: true };
}

/**
 * Valida un nombre
 */
export function validateName(name: string): { isValid: boolean; message?: string } {
  if (!name) {
    return { isValid: false, message: VALIDATION_MESSAGES.required };
  }
  
  if (name.length < VALIDATION_RULES.name.minLength) {
    return { isValid: false, message: `El nombre debe tener al menos ${VALIDATION_RULES.name.minLength} caracteres` };
  }
  
  if (!VALIDATION_PATTERNS.name.test(name)) {
    return { isValid: false, message: VALIDATION_MESSAGES.name };
  }
  
  return { isValid: true };
}

/**
 * Valida una fecha de nacimiento
 */
export function validateBirthDate(day: string, month: string, year: string): { 
  isValid: boolean; 
  message?: string;
  date?: string; 
} {
  if (!day || !month || !year) {
    return { isValid: false, message: VALIDATION_MESSAGES.required };
  }
  
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Verificar que el día no cambió (detecta fechas inválidas)
  if (date.getDate() !== parseInt(day)) {
    return { isValid: false, message: VALIDATION_MESSAGES.invalidDay };
  }
  
  // Verificar que la fecha sea en el pasado
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date >= today) {
    return { isValid: false, message: VALIDATION_MESSAGES.pastDate };
  }
  
  // Verificar edad mínima
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - VALIDATION_RULES.age.minimum);
  if (date > minAgeDate) {
    return { isValid: false, message: VALIDATION_MESSAGES.minAge };
  }
  
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return { isValid: true, date: formattedDate };
}
