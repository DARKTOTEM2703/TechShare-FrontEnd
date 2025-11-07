'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Ui/ToastContext';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';
import TextField from '@/components/Inputs/TextField';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '@/constants/validation';
import '@/styles/containers.css';
import '@/styles/form.css';
import '@/styles/buttons.css';

interface UserProfile {
  id: number;
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  birthDate?: string;
  gender?: string;
}

/**
 * Página para Editar Perfil del Usuario
 * Permite cambiar: nombre, apellido, fecha de nacimiento, género
 * No permite cambiar: usuario, email (estos se editan en otros flujos)
 */
export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const userId = params.id as string;

  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    user_name: '',
    email: '',
    first_name: '',
    last_name: '',
    birthDate: '',
    gender: ''
  });

  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoading: roleLoading, isAuthenticated, userData, error: roleError } = useRoleCheck();

  // Cargar datos del usuario desde el contexto global
  useEffect(() => {
    if (roleLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (userData) {
        type AnyUser = Partial<{
          id: number;
          userName: string;
          user_name: string;
          email: string;
          firstName: string;
          first_name: string;
          lastName: string;
          last_name: string;
          birthDate: string;
          birth_date: string;
          gender: string;
        }>;

        const ud = userData as AnyUser;

        setFormData({
          id: ud.id ?? 0,
          user_name: ud.userName ?? ud.user_name ?? '',
          email: ud.email ?? '',
          first_name: ud.firstName ?? ud.first_name ?? '',
          last_name: ud.lastName ?? ud.last_name ?? '',
          birthDate: ud.birthDate ?? ud.birth_date ?? undefined,
          gender: ud.gender ?? undefined,
        });

        if (ud.birthDate ?? ud.birth_date) {
          const date = new Date(ud.birthDate ?? ud.birth_date!);
          setBirthDay(date.getDate().toString());
          setBirthMonth((date.getMonth() + 1).toString());
          setBirthYear(date.getFullYear().toString());
        }
        setError(null);
      } else if (roleError) {
        setError(roleError);
        toast.addToast('error', roleError);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      toast.addToast('error', message);
    } finally {
      setIsLoading(false);
    }
  }, [roleLoading, isAuthenticated, userData, roleError, router, toast]);

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
    if (!formData.first_name?.trim()) {
      toast.addToast('error', VALIDATION_MESSAGES.required);
      return;
    }

    if (!VALIDATION_PATTERNS.name.test(formData.first_name)) {
      toast.addToast('error', VALIDATION_MESSAGES.name);
      return;
    }

    if (!VALIDATION_PATTERNS.name.test(formData.last_name)) {
      toast.addToast('error', VALIDATION_MESSAGES.name);
      return;
    }

    setIsSaving(true);

    try {
      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      let birthDate = null;
      if (birthDay && birthMonth && birthYear) {
        birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      }

      const updateData: Record<string, unknown> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        ...(birthDate && { birthDate }),
        ...(formData.gender && { gender: formData.gender })
      };

      const response = await fetch(endpoints.users.update(parseInt(userId)), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al actualizar perfil' }));
        throw new Error(error.message || 'Error al actualizar');
      }

      toast.addToast('success', 'Perfil actualizado exitosamente');
      router.push('/profile');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast.addToast('error', message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="form-container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="form-container text-center">
          <h1 className="text-primary font-bold mb-4">ERROR</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/profile">
            <button className="primary-button font-bold w-full">
              VOLVER AL PERFIL
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="form-container max-w-2xl">
        <h1 className="text-primary font-bold text-3xl mb-8">EDITAR PERFIL</h1>

        <form onSubmit={handleSubmit}>
          {/* Información de Solo Lectura */}
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600"><strong>Usuario:</strong> {formData.user_name}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {formData.email}</p>
            <p className="text-xs text-gray-500 mt-2">Estos campos no se pueden cambiar aquí</p>
          </div>

          {/* Nombre */}
          <TextField
            placeholder="Nombre"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          {/* Apellido */}
          <TextField
            placeholder="Apellido"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          {/* Fecha de Nacimiento */}
          <div className="mb-4">
            <label className="block text-primary font-semibold mb-2">Fecha de Nacimiento</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                title="Día"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                title="Mes"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Mes</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                title="Año"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Año</option>
                {Array.from({ length: 100 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Género */}
          <div className="mb-6">
            <label className="block text-primary font-semibold mb-2">Género</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Mujer"
                  checked={formData.gender === 'Mujer'}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-4 h-4 text-primary"
                />
                <span>Mujer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Hombre"
                  checked={formData.gender === 'Hombre'}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-4 h-4 text-primary"
                />
                <span>Hombre</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Otro"
                  checked={formData.gender === 'Otro'}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-4 h-4 text-primary"
                />
                <span>Otro</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={isSaving}
              className={`primary-button font-bold w-full ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
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
      </div>
    </div>
  );
}
