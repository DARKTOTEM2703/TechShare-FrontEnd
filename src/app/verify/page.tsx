'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/verify.css';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado');
      return;
    }

    const verifyAccount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/verify?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const text = await response.text();

        if (response.ok) {
          setStatus('success');
          setMessage(text || 'Cuenta verificada exitosamente');
        } else {
          setStatus('error');
          setMessage(text || 'Error al verificar la cuenta. El token puede haber expirado.');
        }
      } catch {
        setStatus('error');
        setMessage('Error de conexión con el servidor. Por favor, intenta más tarde.');
      }
    };

    verifyAccount();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
          {/* Logo o Icono */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 animate-pulse">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}

            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 animate-bounce">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold mb-3 verify-title">
            {status === 'loading' && 'Verificando tu cuenta...'}
            {status === 'success' && '¡Cuenta Verificada!'}
            {status === 'error' && 'Error de Verificación'}
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 mb-6 text-lg">
            {message || (status === 'loading' && 'Por favor espera mientras verificamos tu cuenta')}
          </p>

          {/* Botones de Acción */}
          {status === 'success' && (
            <div className="space-y-3">
              <Link href="/login">
                <button className="w-full verify-btn-primary font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Iniciar Sesión
                </button>
              </Link>
              <Link href="/home">
                <button className="w-full bg-gray-100 verify-btn-secondary font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-200">
                  Ir al Inicio
                </button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Link href="/register">
                <button className="w-full verify-btn-primary font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Registrarse de Nuevo
                </button>
              </Link>
              <Link href="/home">
                <button className="w-full bg-gray-100 verify-btn-secondary font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-200">
                  Volver al Inicio
                </button>
              </Link>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda?{' '}
              <Link href="/home" className="verify-link font-medium">
                Contacta con soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 animate-pulse">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3 verify-title">
              Verificando tu cuenta...
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Por favor espera mientras verificamos tu cuenta
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
