'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Ui/ToastContext';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';
import PasswordField from '@/components/Inputs/PasswordField';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '@/constants/validation';
import '@/styles/containers.css';
import '@/styles/form.css';
import '@/styles/buttons.css';

/**
 * Página para Cambiar Contraseña del Usuario
 * Valida:
 * - Contraseña actual sea correcta
 * - Nueva contraseña cumpla requisitos
 * - Confirmación sea igual a nueva contraseña
 */
export default function ChangePasswordPage() {
  const router = useRouter();
  const toast = useToast();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!formData.currentPassword) {
      toast.addToast('error', 'Debes ingresar tu contraseña actual');
      return;
    }

    if (!formData.newPassword) {
      toast.addToast('error', 'Debes ingresar una nueva contraseña');
      return;
    }

    if (!VALIDATION_PATTERNS.password.test(formData.newPassword)) {
      toast.addToast('error', VALIDATION_MESSAGES.password);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.addToast('error', VALIDATION_MESSAGES.passwordMismatch);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.addToast('error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setIsLoading(true);

    try {
      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      // 🔑 CONSUMIR ENDPOINT DEL BACKEND
      const response = await fetch(endpoints.users.changePassword, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al cambiar contraseña' }));
        throw new Error(error.message || 'Error al cambiar contraseña');
      }

      toast.addToast('success', 'Contraseña actualizada exitosamente');
      
      // Volver al perfil
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast.addToast('error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="form-container max-w-lg">
        <h1 className="text-primary font-bold text-3xl mb-8">CAMBIAR CONTRASEÑA</h1>

        <form onSubmit={handleSubmit}>
          {/* Contraseña Actual */}
          <PasswordField
            placeholder="Contraseña Actual"
            name="currentPassword"
            value={formData.currentPassword}
            handleChange={handleChange}
          />

          {/* Nueva Contraseña */}
          <PasswordField
            placeholder="Nueva Contraseña"
            name="newPassword"
            value={formData.newPassword}
            handleChange={handleChange}
          />

          {/* Confirmar Nueva Contraseña */}
          <PasswordField
            placeholder="Confirmar Nueva Contraseña"
            name="confirmPassword"
            value={formData.confirmPassword}
            handleChange={handleChange}
          />

          {/* Requisitos de Contraseña */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-semibold mb-2">La contraseña debe:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✓ Tener mínimo 8 caracteres</li>
              <li>✓ Incluir mayúsculas (A-Z)</li>
              <li>✓ Incluir minúsculas (a-z)</li>
              <li>✓ Incluir números (0-9)</li>
              <li>✓ Incluir caracteres especiales (@$!%*?&_-#.,:;)</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`primary-button font-bold w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
            </button>

            <Link href="/profile" className="block">
              <button
                type="button"
                className="secondary-button font-bold w-full border-2 border-gray-400 text-gray-600"
              >
                CANCELAR
              </button>
            </Link>
          </div>
        </form>

        {/* Ayuda */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Nota de Seguridad:</strong> Si olvidaste tu contraseña, usa la opción de &quot;Olvidé mi contraseña&quot; en la página de login.
          </p>
        </div>
      </div>
    </div>
  );
}
