'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/form.css';
import '@/styles/buttons.css';

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="form-container w-[50vh] text-center">
        {/* Logo TechShare */}
        <h2 className="text-4xl font-bold mb-8 text-primary">TechShare</h2>

        {/* Icono según estado */}
        <div className="mb-6">
          {status === 'loading' && (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 animate-pulse">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Título según estado */}
        <h1 className="text-primary font-bold text-2xl mb-4">
          {status === 'loading' && 'VERIFICANDO CUENTA...'}
          {status === 'success' && '¡CUENTA VERIFICADA!'}
          {status === 'error' && 'ERROR DE VERIFICACIÓN'}
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          {message || (status === 'loading' && 'Por favor espera mientras verificamos tu cuenta')}
        </p>

        {/* Botones de Acción */}
        {status === 'success' && (
          <div className="space-y-3">
            <Link href="/login">
              <button className="primary-button font-bold w-full">
                INICIAR SESIÓN
              </button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <Link href="/register">
              <button className="primary-button font-bold w-full">
                REGISTRARSE DE NUEVO
              </button>
            </Link>
            <Link href="/">
              <button className="secondary-button font-bold w-full">
                VOLVER AL INICIO
              </button>
            </Link>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Información adicional */}
        <p className="mt-6 text-sm text-gray-500">
          ¿Necesitas ayuda?{' '}
          <Link href="/" className="text-primary font-medium hover:underline">
            Contacta con soporte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="form-container w-[50vh] text-center">
          <h2 className="text-4xl font-bold mb-8 text-primary">TechShare</h2>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 animate-pulse">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-primary font-bold text-2xl mb-4">
            VERIFICANDO CUENTA...
          </h1>
          <p className="text-gray-600 mb-6">
            Por favor espera mientras verificamos tu cuenta
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
