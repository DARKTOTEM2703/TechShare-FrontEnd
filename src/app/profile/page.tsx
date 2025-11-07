'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Ui/ToastContext';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import '@/styles/containers.css';
import '@/styles/buttons.css';

interface UserProfile {
  id: number;
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  birthDate?: string;
  gender?: string;
  created_at?: string;
}

/**
 * Página de Perfil del Usuario
 * Muestra información del usuario autenticado y opciones para editar
 */
export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, isAuthenticated, userData, error: contextError } = useRoleCheck();

  useEffect(() => {
    // Wait for global role check to finish
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (userData) {
        // Map provider fields to local shape (handle different naming conventions)
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
          createdAt: string;
          created_at: string;
        }>;

        const ud = userData as AnyUser;

        setProfile({
          id: ud.id ?? 0,
          user_name: ud.userName ?? ud.user_name ?? '',
          email: ud.email ?? '',
          first_name: ud.firstName ?? ud.first_name ?? '',
          last_name: ud.lastName ?? ud.last_name ?? '',
          birthDate: ud.birthDate ?? ud.birth_date ?? undefined,
          gender: ud.gender ?? undefined,
          created_at: ud.createdAt ?? ud.created_at ?? undefined,
        });

        setError(null);
      } else if (contextError) {
        setError(contextError);
        toast.addToast('error', contextError);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      toast.addToast('error', message);
    } finally {
      setIsLoadingLocal(false);
    }
  }, [isLoading, isAuthenticated, userData, contextError, router, toast]);

  if (isLoading || isLoadingLocal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="form-container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="form-container text-center">
          <h1 className="text-primary font-bold mb-4">ERROR</h1>
          <p className="text-red-600 mb-6">{error || 'No se pudo cargar el perfil'}</p>
          <Link href="/admin">
            <button className="primary-button font-bold w-full">
              VOLVER AL PANEL
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="form-container max-w-2xl">
        <h1 className="text-primary font-bold text-3xl mb-8">MI PERFIL</h1>

        {/* Información del Usuario */}
        <div className="space-y-6">
          {/* Nombre de Usuario */}
          <div className="border-b pb-4">
            <label className="text-sm text-gray-600 font-semibold">USUARIO</label>
            <p className="text-lg text-primary font-bold">{profile.user_name}</p>
          </div>

          {/* Email */}
          <div className="border-b pb-4">
            <label className="text-sm text-gray-600 font-semibold">EMAIL</label>
            <p className="text-lg text-gray-800">{profile.email}</p>
          </div>

          {/* Nombre */}
          <div className="border-b pb-4">
            <label className="text-sm text-gray-600 font-semibold">NOMBRE</label>
            <p className="text-lg text-gray-800">{profile.first_name}</p>
          </div>

          {/* Apellido */}
          <div className="border-b pb-4">
            <label className="text-sm text-gray-600 font-semibold">APELLIDO</label>
            <p className="text-lg text-gray-800">{profile.last_name}</p>
          </div>

          {/* Fecha de Nacimiento */}
          {profile.birthDate && (
            <div className="border-b pb-4">
              <label className="text-sm text-gray-600 font-semibold">FECHA DE NACIMIENTO</label>
              <p className="text-lg text-gray-800">
                {new Date(profile.birthDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Género */}
          {profile.gender && (
            <div className="border-b pb-4">
              <label className="text-sm text-gray-600 font-semibold">GÉNERO</label>
              <p className="text-lg text-gray-800">{profile.gender}</p>
            </div>
          )}

          {/* Fecha de Creación */}
          {profile.created_at && (
            <div className="border-b pb-4">
              <label className="text-sm text-gray-600 font-semibold">MIEMBRO DESDE</label>
              <p className="text-lg text-gray-800">
                {new Date(profile.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-8 space-y-3">
          <Link href={`/profile/edit/${profile.id}`}>
            <button className="primary-button font-bold w-full">
              EDITAR PERFIL
            </button>
          </Link>

          <Link href="/profile/change-password">
            <button className="secondary-button font-bold w-full border-2 border-primary text-primary">
              CAMBIAR CONTRASEÑA
            </button>
          </Link>

          <Link href="/logout">
            <button className="secondary-button font-bold w-full border-2 border-red-600 text-red-600">
              CERRAR SESIÓN
            </button>
          </Link>
        </div>

        {/* Volver */}
        <div className="mt-6">
          <Link href="/admin">
            <p className="text-primary font-semibold text-center cursor-pointer hover:underline">
              ← Volver al Panel
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
